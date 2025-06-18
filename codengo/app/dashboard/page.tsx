'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';


export default function Dashboard() {
  const [username, setUsername] = useState('username01');
  const [profilePic, setProfilePic] = useState('/profile.jpg');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/users/me');
        if (res.data?.user?.name) {
          setUsername(res.data.user.name);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    const pic = localStorage.getItem('profileImage');
    if (pic) setProfilePic(pic);

    fetchUser();
  }, []);

  const handleJoinRoom = async () => {
    if (!roomId.trim()) {
      toast.error("Please enter a Room ID");
      return;
    }

    try {
      const res = await axios.get(`/api/rooms/${roomId}`);
      if (res.status === 200) {
        router.push(`/room/${roomId}`);
      }
    } catch (err) {
      toast.error("Room ID not found");
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Toaster position="top-center" />

      {/* Sidebar */}
      <aside className="relative w-64 bg-[#1E1E1E] p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide mb-4">
            CoDe<span className="text-purple-500">N</span>go
          </h1>

          <div className="space-y-4 mt-6">
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2">
              CREATE ROOM <span className="text-xl">＋</span>
            </button>
            <button
              onClick={() => setShowJoinModal(true)}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2"
            >
              JOIN ROOM <span className="text-xl">🔑</span>
            </button>
          </div>

          <div className="mt-10 text-sm font-semibold">MY ROOMS</div>
          <ul className="mt-4 space-y-2 text-sm text-gray-300">
            <li className="hover:text-white cursor-pointer">🔥 React Pairing Room</li>
            <li className="hover:text-white cursor-pointer">🚀 LLM Hackathon Team</li>
            <li className="hover:text-white cursor-pointer">🔒 Private Debug Zone</li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 space-y-10 overflow-y-auto">
        <section>
          <h2 className="text-lg font-semibold mb-4">MY ROOMS</h2>
          <div className="bg-[#2A2A2A] rounded-xl p-4 space-y-2">
            <div className="bg-[#3A3A3A] p-3 rounded-md">🔧 Code Collab with Aman</div>
            <div className="bg-[#3A3A3A] p-3 rounded-md">🧠 AI Prompt Studio</div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Previously Joined Rooms</h2>
          <div className="bg-[#2A2A2A] rounded-xl p-4 space-y-2">
            <div className="bg-[#3A3A3A] p-3 rounded-md">💬 Group Discussion Night</div>
            <div className="bg-[#3A3A3A] p-3 rounded-md">🌐 Open Source Room</div>
          </div>
        </section>
      </main>

      {/* Right Profile Panel */}
      <aside className="w-72 p-6 border-l border-gray-700 flex flex-col items-center space-y-4">
        <Link href="/profile">
  <div className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer hover:scale-105 transition-transform">
    <Image
      src={profilePic}
      alt="Profile"
      fill
      className="object-cover"
    />
  </div>
</Link>

        <div className="text-center">
          <h3 className="text-lg font-bold">{username}</h3>
          <p className="text-sm text-gray-400">@solanki018</p>
        </div>
      </aside>

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center transition-all">
          <div className="bg-[#1E1E1E] text-white p-10 rounded-2xl shadow-2xl w-[32rem] relative animate-fadeIn border border-zinc-700">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
              onClick={() => setShowJoinModal(false)}
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold text-center mb-6">🚪 Join a Room</h2>

            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-5 py-3 rounded-lg bg-zinc-800 border border-zinc-600 text-lg mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              onClick={handleJoinRoom}
              className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-md font-semibold text-lg transition-all"
            >
              Join Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
