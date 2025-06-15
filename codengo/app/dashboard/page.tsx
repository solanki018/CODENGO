'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="relative w-64 bg-[#1E1E1E] p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide mb-4">
            CoDe<span className="text-purple-500">N</span>go
          </h1>

          <button className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2">
            CREATE ROOM <span className="text-xl">＋</span>
          </button>

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
        <div className="relative w-24 h-24 rounded-full overflow-hidden">
          <Image
            src="/profile.jpg" // Replace with actual user image
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold">SOURABH SOLANKI</h3>
          <p className="text-sm text-gray-400">@solanki018</p>
        </div>
        <Link href="/profile" className="mt-2 w-full">
          <button className="w-full px-4 py-2 text-sm border border-gray-400 rounded-md hover:bg-gray-700 transition">
            EDIT PROFILE
          </button>
        </Link>
      </aside>
    </div>
  );
}
