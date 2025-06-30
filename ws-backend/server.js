const http = require('http');
const WebSocket = require('ws');
const ShareDB = require('sharedb');
const connectMongo = require('sharedb-mongo');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { configDotenv } = require('dotenv');
const mongoose = require('mongoose');
configDotenv();

// MongoDB-backed ShareDB instance
const db = connectMongo(process.env.MONGO_URI);
const backend = new ShareDB({ db });


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('[MongoDB] Connected successfully'))
  .catch((err) => console.error('[MongoDB] Connection error:', err));

const server = http.createServer();
const wss = new WebSocket.Server({ server });
const PORT = 3001;

// === ROOM MANAGEMENT ===
class Room {
  constructor(roomId) {
    this.id = roomId;
    this.clients = new Map(); // userId -> socket
    this.files = ['hello.py']; // default
  }

  addClient(userId, socket) {
    this.clients.set(userId, socket);
  }

  removeClient(userId) {
    this.clients.delete(userId);
  }

  broadcast(message, excludeId = null) {
    for (const [uid, socket] of this.clients) {
      if (uid !== excludeId && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
      }
    }
  }

  addFile(filename) {
    if (!this.files.includes(filename)) {
      this.files.push(filename);
    }
  }

  removeFile(filename) {
    this.files = this.files.filter(f => f !== filename);
  }

  hasNoClients() {
    return this.clients.size === 0;
  }
}

const rooms = new Map(); // roomId -> Room

// === HANDLE CONNECTIONS ===
wss.on('connection', (ws, req) => {
  console.log('Client connected');
  console.log(`Request URL: ${req.url}`);
  

  if (req.url === '/ot') {
    console.log('Connecting to ShareDB over WebSocket');
    const stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
    return;
  }

  ws.on('message', async (msg) => {
    // console.log(`Received message: ${msg}`);
    const data = JSON.parse(msg);

    const { type, roomId, userId } = data;

    if (type === 'list-files') {
      const roomId = data.roomId;
      const room = rooms.get(roomId);
      console.log(room)
      if (!room) {
        ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
        return;
      }

      const files = room.files || ['hello.py']; // fallback
      console.log(files)
      ws.send(JSON.stringify({ type: 'file-list', files }));
    }

    if (type === 'create-file') {
      const { filename, roomId } = data;
      const docId = `${roomId}-${filename}`;
      const doc = backend.connect().get('files', docId);
      doc.fetch((err) => {
        if (err) throw err;
        if (!doc.type) {
          doc.create({ content: '' });
        }
      });

      // Register filename in room state
      const room = rooms.get(roomId);
      room.fileSet.add(filename); // <- keep track of known files

      // Broadcast new file to all clients in the room
      room.broadcast({
        type: 'new-file',
        filename,
      });
    }

    if (type === 'rename-file') {
      assertUserId(data, ws);
      assertRoomExists(roomId);

      const room = rooms.get(roomId);
      const { oldName, newName } = data;

      if (!room.files.includes(oldName)) {
        ws.send(JSON.stringify({ type: 'error', message: `File "${oldName}" does not exist` }));
        return;
      }

      if (room.files.includes(newName)) {
        ws.send(JSON.stringify({ type: 'error', message: `File "${newName}" already exists` }));
        return;
      }

      // Update the file list
      const index = room.files.indexOf(oldName);
      room.files[index] = newName;

      // You might optionally migrate the ShareDB doc
      // But ShareDB does not support renaming doc IDs directly
      // So you’d need to copy+delete if necessary

      // Notify the requester
      ws.send(JSON.stringify({ type: 'file-renamed', oldName, newName }));

      // Broadcast to other users
      room.broadcastExcept(ws, {
        type: 'file-renamed',
        oldName,
        newName,
      });
    }

    if (type === 'create') {
      assertUserId(data, ws);

      const newRoomId = uuidv4().slice(0, 6);
      const room = new Room(newRoomId);
      room.addClient(userId, ws);
      rooms.set(newRoomId, room);

      ws.roomId = newRoomId;
      ws.userId = userId;

      // Create OT document
      const conn = backend.connect();
      const doc = conn.get('files', newRoomId);
      doc.fetch((err) => {
        if (err) throw err;
        if (!doc.type) {
          doc.create({ content: '' });
        }
      });

      // console all members of room
      console.log(`Room ${newRoomId} created by user ${userId}`);
      console.log(`Members: ${Array.from(room.clients.keys()).join(', ')}`);

      ws.send(JSON.stringify({ type: 'room-created', roomId: newRoomId }));
    }

    if (type === 'join') {

      assertUserId(data, ws);
      assertRoomExists(roomId, ws);

      const room = rooms.get(roomId);
      room.addClient(userId, ws);
      ws.roomId = roomId;
      ws.userId = userId;

      console.log(`Members: ${Array.from(room.clients.keys()).join(', ')}`);

      ws.send(JSON.stringify({ type: 'joined', roomId }));
    }
    

    if (type === 'run') {

      assertRoomExists(roomId, ws);
      const output = await runCodeInDocker(data.language, data.code, roomId);
      const room = rooms.get(roomId);
      if (room) {
        room.broadcast({ type: 'result', output });
      }
    }
  });

  ws.on('close', () => {
    const roomId = ws.roomId;
    const userId = ws.userId;

    // if (roomId && rooms.has(roomId)) {
    //   const room = rooms.get(roomId);
    //   room.removeClient(userId);
    //   if (room.hasNoClients()) {
    //     rooms.delete(roomId);
    //     console.log(`Room ${roomId} deleted (no users left)`);
    //   }
    // }
  });

  // // Connect ShareDB stream
  // const stream = new WebSocketJSONStream(ws);
  // backend.listen(stream);
});

function sendError(ws, message) {
  ws.send(JSON.stringify({
    type: 'error',
    message
  }));
}

function assertUserId(data, ws) {
  if (!data.userId) {
    sendError(ws, 'userId is required for this action.');
    throw new Error('Missing userId');
  }
}

function assertRoomExists(roomId, ws) {
  if (!roomId || !rooms.has(roomId)) {
    sendError(ws, `Room '${roomId}' does not exist.`);
    throw new Error(`Room not found: ${roomId}`);
  }
}


// === DOCKER CODE EXECUTION ===
async function runCodeInDocker(language, code, roomId) {
  const supported = {
    cpp: { filename: 'main.cpp', image: 'gcc:latest', compile: true },
    python: { filename: 'script.py', image: 'python:3.10', compile: false }
  };

  if (!supported[language]) return 'Unsupported language';

  const { filename, image, compile } = supported[language];
  const roomDir = path.join(__dirname, 'tmp', roomId);
  fs.mkdirSync(roomDir, { recursive: true });

  const filePath = path.join(roomDir, filename);
  fs.writeFileSync(filePath, code);

  let dockerCommand;
  if (compile) {
    dockerCommand = `docker run --rm -v ${roomDir}:/code ${image} sh -c "g++ /code/${filename} -o /code/a.out && /code/a.out"`;
  } else {
    dockerCommand = `docker run --rm -v ${roomDir}:/code ${image} python /code/${filename}`;
  }

  return new Promise((resolve) => {
    exec(dockerCommand, (err, stdout, stderr) => {
      if (err) resolve(`Error: ${stderr || err.message}`);
      else resolve(stdout);
    });
  });
}

server.listen(PORT, () => {
  console.log(`WebSocket server listening on ws://localhost:${PORT}`);
});
