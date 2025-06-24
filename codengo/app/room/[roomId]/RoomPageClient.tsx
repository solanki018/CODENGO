'use client';

import { RoomProvider } from './RoomContext';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import RightPanel from './components/RightPanel';

export default function RoomPageClient({
  roomId,
}: {
  roomId: string;
}) {
  return (
    <RoomProvider roomId={roomId}>
      <div className="flex min-h-screen h-screen bg-black text-white overflow-hidden">
        <Sidebar />
        <Editor />
        <RightPanel />
      </div>
    </RoomProvider>
  );
}
