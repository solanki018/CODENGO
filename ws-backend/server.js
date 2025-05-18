const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const PORT = 3001;

wss.on('connection', (socket) => {
    console.log('Client connected');


    socket.on('message', (message) => {
        console.log('Received:', message.toString());

        // Broadcast to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                console.log('Broadcasting:', message.toString());
                client.send(JSON.stringify({
                    type: 'update',
                    content: message.toString(),
                }));
            }
        });
    });

    socket.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`WebSocket server listening on ws://localhost:${PORT}`);
});
