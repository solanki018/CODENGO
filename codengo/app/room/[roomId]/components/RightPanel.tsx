'use client';

import { useEffect, useRef, useState } from 'react';
import { FaMicrophone } from 'react-icons/fa';
import socket from '@/lib/socket';
import { useParams } from 'next/navigation'; // 👈 added

interface User {
  socketId: string;
  name: string;
  isSpeaking: boolean;
}

interface Message {
  senderId: string;
  text: string;
}

const peerConnections: Record<string, RTCPeerConnection> = {};
const config = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export default function RightPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [myName, setMyName] = useState('');
  const [mySocketId, setMySocketId] = useState('');
  const [isMicOn, setIsMicOn] = useState(false);

  const localStream = useRef<MediaStream | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  // const roomId = 'codengo-room';
   const { roomId } = useParams(); // 👈 dynamic route param
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
      const res = await fetch('/api/users/me', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        const name = data.user.firstName || data.user.username || 'Anonymous';
        setMyName(name);
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      }
    };

    fetchUser();
  }, []);

  // Initialize socket once myName is ready
  useEffect(() => {
    if (!myName) return;

    socket.connect();

    socket.on('connect', () => {
      setMySocketId(socket.id ?? '');
      socket.emit('join-room', { roomId, name: myName });
    });

    socket.on('update-users', (userList: User[]) => {
      const uniqueUsers = Array.from(new Map(userList.map(user => [user.socketId, user])).values());
      setUsers(uniqueUsers);
    });

    socket.on('receive-message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('update-mic', ({ userId, isSpeaking }: { userId: string; isSpeaking: boolean }) => {
      setUsers((prev) =>
        prev.map((u) =>
          u.socketId === userId ? { ...u, isSpeaking } : u
        )
      );
    });

    socket.on('offer', async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
      const pc = createPeerConnection(from);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { to: from, answer });
    });

    socket.on('answer', async ({ from, answer }: { from: string; answer: RTCSessionDescriptionInit }) => {
      await peerConnections[from]?.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', ({ from, candidate }: { from: string; candidate: RTCIceCandidateInit }) => {
      peerConnections[from]?.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      socket.disconnect();
      Object.values(peerConnections).forEach(pc => pc.close());
    };
  }, [myName]);

  const createPeerConnection = (socketId: string) => {
    const pc = new RTCPeerConnection(config);

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit('ice-candidate', { to: socketId, candidate: e.candidate });
      }
    };

    pc.ontrack = (e) => {
      const audio = new Audio();
      audio.srcObject = e.streams[0];
      audio.autoplay = true;
      audioRefs.current[socketId] = audio;
    };

    localStream.current?.getTracks().forEach(track => pc.addTrack(track, localStream.current!));
    peerConnections[socketId] = pc;

    return pc;
  };

  const toggleMic = async () => {
    if (!isMicOn) {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsMicOn(true);
        socket.emit('update-mic', { roomId, userId: mySocketId, isSpeaking: true });

        users.forEach(async (user) => {
          if (user.socketId !== mySocketId) {
            const pc = createPeerConnection(user.socketId);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit('offer', { to: user.socketId, offer });
          }
        });
      } catch (err) {
        console.error('Mic access denied', err);
      }
    } else {
      setIsMicOn(false);
      localStream.current?.getTracks().forEach(t => t.stop());
      socket.emit('update-mic', { roomId, userId: mySocketId, isSpeaking: false });
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit('send-message', {
      roomId,
      message: input,
      sender: mySocketId,
    });
    setInput('');
  };

  const getUser = (id: string) => users.find((u) => u.socketId === id);

  return (
    <aside className="w-80 h-screen bg-[#1a1a1a] text-white flex flex-col border-l rounded-2xl border-[#333]">
      <div className="p-4 border-b border-[#333]">
        <h2 className="text-sm text-gray-400 mb-2">Active Users</h2>
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.socketId}
              className="flex items-center justify-between text-sm bg-[#262626] p-2 rounded-md"
            >
              <span>{user.name}</span>
              <div className="flex items-center gap-2">
                {user.isSpeaking && <FaMicrophone className="text-green-500" />}
                {user.socketId === mySocketId && (
                  <button
                    onClick={toggleMic}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    {isMicOn ? 'Mute' : 'Mic'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#1e1e1e]">
        {messages.map((msg, i) => {
          const sender = getUser(msg.senderId);
          const isMe = msg.senderId === mySocketId;

          return (
            <div
              key={i + msg.senderId + msg.text.slice(0, 5)}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-xl ${
                  isMe
                    ? 'bg-[#4caf50] text-black rounded-br-none'
                    : 'bg-[#333] text-white rounded-bl-none'
                }`}
              >
                {!isMe && (
                  <div className="text-xs text-gray-400 mb-1">{sender?.name}</div>
                )}
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-[#333] bg-[#1a1a1a]">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 bg-[#1e1e1e] text-white text-sm p-2 rounded-md focus:outline-none"
            placeholder="Type a message"
          />
          <button
            onClick={sendMessage}
            className="bg-white text-black px-3 rounded-md text-sm hover:scale-105 transition"
          >
            Send
          </button>
        </div>
      </div>
    </aside>
  );
}
