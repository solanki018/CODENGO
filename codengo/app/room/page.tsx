// File: app/room/page.tsx
'use client';

import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import RightPanel from './components/RightPanel';

export default function RoomPage() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <Editor />
      <RightPanel />
    </div>
  );
}
