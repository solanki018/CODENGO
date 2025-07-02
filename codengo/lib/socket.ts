// lib/socket.ts
import io from 'socket.io-client';

const socket = io('https://codengo-1w21.onrender.com', {
  autoConnect: false,
});

export default socket;
