// server.ts
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

type User = {
  socketId: string;
  name: string;
  isSpeaking: boolean;
};

const roomUsers: Record<string, User[]> = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomId, name }) => {
    socket.join(roomId);

    const newUser: User = {
      socketId: socket.id,
      name,
      isSpeaking: false,
    };

    if (!roomUsers[roomId]) roomUsers[roomId] = [];
    roomUsers[roomId].push(newUser);

    io.to(roomId).emit('update-users', roomUsers[roomId]);
  });

  socket.on('send-message', ({ roomId, message, sender }) => {
    io.to(roomId).emit('receive-message', {
      senderId: sender,
      text: message,
    });
  });

  socket.on('toggle-mic', ({ roomId, userId, isSpeaking }) => {
    const users = roomUsers[roomId];
    if (users) {
      const user = users.find((u) => u.socketId === userId);
      if (user) {
        user.isSpeaking = isSpeaking;
        io.to(roomId).emit('update-mic', { userId, isSpeaking });
      }
    }
  });

  socket.on('disconnect', () => {
    for (const roomId in roomUsers) {
      roomUsers[roomId] = roomUsers[roomId].filter(
        (u) => u.socketId !== socket.id
      );
      io.to(roomId).emit('update-users', roomUsers[roomId]);
    }
    console.log('User disconnected:', socket.id);
  });
  socket.on('offer', ({ to, offer }) => {
  io.to(to).emit('offer', { from: socket.id, offer });
});

socket.on('answer', ({ to, answer }) => {
  io.to(to).emit('answer', { from: socket.id, answer });
});

socket.on('ice-candidate', ({ to, candidate }) => {
  io.to(to).emit('ice-candidate', { from: socket.id, candidate });
});

});

httpServer.listen(3001, () => {
  console.log('✅ Socket.IO server running on http://localhost:3001');
});
