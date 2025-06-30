'use client';

import { useState, useRef, useEffect } from 'react';
import { FaMicrophone } from 'react-icons/fa';

interface User {
  id: number;
  name: string;
  isSpeaking: boolean;
}

interface Message {
  senderId: number;
  text: string;
}

export default function RightPanel() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Sourabh', isSpeaking: false },
    { id: 2, name: 'Ankit', isSpeaking: false },
    { id: 3, name: 'Priya', isSpeaking: false },
    { id: 4, name: 'Ravi', isSpeaking: false },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    { senderId: 1, text: 'Hey team!' },
    { senderId: 2, text: 'Hello everyone' },
    { senderId: 3, text: 'Ready to start?' },
  ]);

  const [input, setInput] = useState('');
  const [activeUserId, setActiveUserId] = useState(1);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { senderId: activeUserId, text: input }]);
    setInput('');
  };

  const toggleMic = (id: number) => {
    setUsers(users.map((user) =>
      user.id === id ? { ...user, isSpeaking: !user.isSpeaking } : user
    ));
  };

  const getUser = (id: number) => users.find((u) => u.id === id);

  return (
    <aside className="w-80 h-screen bg-[#1a1a1a] text-white flex flex-col border-l rounded-2xl border-[#333]">
      
      {/* Top: Active Users */}
      <div className="p-4 border-b border-[#333]">
        <h2 className="text-sm text-gray-400 mb-2">Active Users</h2>
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between text-sm bg-[#262626] p-2 rounded-md"
            >
              <span>{user.name}</span>
              <div className="flex items-center gap-2">
                {user.isSpeaking && <FaMicrophone className="text-green-500" />}
                <button
                  onClick={() => toggleMic(user.id)}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  {user.isSpeaking ? 'Mute' : 'Mic'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle: Chat Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#1e1e1e]">
        {messages.map((msg, i) => {
          const sender = getUser(msg.senderId);
          const isMe = msg.senderId === activeUserId;

          return (
            <div
              key={i}
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

      {/* Bottom: Chat Input */}
      <div className="p-4 border-t border-[#333] bg-[#1a1a1a]">
        <div className="flex gap-2">
          <select
            value={activeUserId}
            onChange={(e) => setActiveUserId(parseInt(e.target.value))}
            className="bg-[#262626] text-white text-xs rounded-md px-2"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

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
