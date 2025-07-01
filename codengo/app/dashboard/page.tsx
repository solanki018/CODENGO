// ✅ FILE: app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';

export default function Dashboard() {
  const [username, setUsername] = useState('Loading...');
  const [profilePic, setProfilePic] = useState('/profile.jpg');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [userId, setUserId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/users/me');
        if (res.data?.user) {
          setUsername(res.data.user.name || "Anonymous");
          setUserId(res.data.user._id);
        } else {
          toast.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to fetch user data");
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

  const handleCreateRoom = async () => {
    if (!userId || !roomName.trim()) {
      toast.error("Enter room name");
      return;
    }

    try {
      const res = await axios.post('/api/createRoom', { userId, roomName });
      if (res.status === 200) {
        toast.success("Room created!");
        router.push(`/room/${res.data.roomId}`);
      } else {
        toast.error("Failed to create room");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Toaster position="top-center" />

      {/* Sidebar */}
      <aside className="w-64 bg-[#1E1E1E] p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-4">
            CoDe<span className="text-purple-500">N</span>go
          </h1>

          <div className="space-y-4 mt-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg"
            >
              CREATE ROOM ＋
            </button>
            <button
              onClick={() => setShowJoinModal(true)}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-2 rounded-lg"
            >
              JOIN ROOM 🔑
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* You can place your main content here */}
      </main>

      {/* Right Profile Panel */}
      <aside className="w-72 p-6 border-l border-gray-700 flex flex-col items-center space-y-4">
        <Link href="/profile">
          <div className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer hover:scale-105 transition-transform">
            <Image src={profilePic} alt="Profile" fill className="object-cover" />
          </div>
        </Link>
        <div className="text-center">
          <h3 className="text-lg font-bold">{username}</h3>
          <p className="text-sm text-gray-400">@solanki018</p>
        </div>
      </aside>

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-[#1E1E1E] text-white p-10 rounded-2xl shadow-2xl w-[32rem] border border-zinc-700 relative">
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
              className="w-full px-5 py-3 rounded-lg bg-zinc-800 border border-zinc-600 text-lg mb-6"
            />

            <button
              onClick={handleJoinRoom}
              className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-md font-semibold text-lg"
            >
              Join Now
            </button>
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-[#1E1E1E] text-white p-10 rounded-2xl shadow-2xl w-[32rem] border border-zinc-700 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
              onClick={() => setShowCreateModal(false)}
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold text-center mb-6">🏠 Create a Room</h2>

            <input
              type="text"
              placeholder="Enter Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-5 py-3 rounded-lg bg-zinc-800 border border-zinc-600 text-lg mb-6"
            />

            <button
              onClick={handleCreateRoom}
              className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-md font-semibold text-lg"
            >
              Create Room
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
