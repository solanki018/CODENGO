const WebSocket = require('ws');
const http = require('http');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const PORT = 3001;

rooms = {};

wss.on('connection', (socket) => {
    console.log('Client connected');


    socket.on('message', async (message) => {
        const data = JSON.parse(message);

        if (data.type === 'create') {
            const newRoomId = uuidv4().slice(0, 6); // shorter, shareable ID like "a8f29c"
            if (!rooms[newRoomId]) {
                rooms[newRoomId] = new Set();
            }
            rooms[newRoomId].add(socket);
            socket.roomId = newRoomId;

            console.log(`New room created: ${newRoomId}`);

            // Respond with roomId
            socket.send(JSON.stringify({
                type: 'room-created',
                roomId: newRoomId
            }));
            return;
        }

        // when joining room
        if (data.type === 'join') {
            const roomId = data.roomId;
            if (!roomId) return;

            // Leave previous room if any
            if (socket.roomId && rooms[socket.roomId]) {
                rooms[socket.roomId].delete(socket);
            }

            // Add to new room
            if (!rooms[roomId]) rooms[roomId] = new Set();
            rooms[roomId].add(socket);
            socket.roomId = roomId;

            console.log(`Client joined room: ${roomId}`);
            socket.send(JSON.stringify({ type: 'joined', roomId }));
        }

        // Client sends code or content
        if (data.type === 'edit' && socket.roomId) {
            const roomId = socket.roomId;

            // Broadcast to other users in same room
            rooms[roomId].forEach((client) => {
                if (client !== socket && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'update',
                        content: data.content,
                        sender: data.sender || null
                    }));
                }
            });
        }

        if (data.type === 'run') {
            const { language, code } = data;
            const roomId = socket.roomId;

            if (!roomId) {
                socket.send(JSON.stringify({ type: 'result', output: 'Not in a room' }));
                return;
            }

            const output = await runCodeInDocker(language, code, roomId);

            // Broadcast result to the entire room
            rooms[roomId].forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'result',
                        output,
                    }));
                }
            });
        }

    });

    socket.on('close', () => {
        const roomId = socket.roomId;
        if (roomId && rooms[roomId]) {
            rooms[roomId].delete(socket);
            if (rooms[roomId].size === 0) {
                delete rooms[roomId];
            }
            console.log(`Client left room: ${roomId}`);
        }
    });
});

async function runCodeInDocker(language, code, roomId) {
    const supported = {
        cpp: { filename: 'main.cpp', image: 'gcc:latest', compile: true },
        python: { filename: 'script.py', image: 'python:3.10', compile: false }
    };

    if (!supported[language]) return 'Unsupported language';

    const { filename, image, compile } = supported[language];
    const roomDir = path.join(__dirname, 'tmp', roomId);

    // Ensure room directory exists
    fs.mkdirSync(roomDir, { recursive: true });

    // Write code to a room-specific file
    const filePath = path.join(roomDir, filename);
    fs.writeFileSync(filePath, code);

    let dockerCommand;

    if (compile) {
        // C++
        dockerCommand = `docker run --rm -v ${roomDir}:/code ${image} sh -c "g++ /code/${filename} -o /code/a.out && /code/a.out"`;
    } else {
        // Python
        dockerCommand = `docker run --rm -v ${roomDir}:/code ${image} python /code/${filename}`;
    }

    return new Promise((resolve) => {
        exec(dockerCommand, (error, stdout, stderr) => {
            if (error) {
                resolve(`Error: ${stderr || error.message}`);
            } else {
                resolve(stdout);
            }
        });
    });
}


server.listen(PORT, () => {
    console.log(`WebSocket server listening on ws://localhost:${PORT}`);
});
