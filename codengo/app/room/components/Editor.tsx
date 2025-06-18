'use client';

import MultiFileEditor from '@/app/components/editor';
import { useRoomContext } from '../RoomContext';

export default function Editor() {
  const { files, setFiles, activeFile } = useRoomContext();

  return (
    <main className="flex-1 p-6 flex flex-col gap-6">
      {/* Editor */}
      <div className="flex-1 min-h-0 bg-[#2a2a2a] rounded-xl p-0 overflow-hidden">
        <MultiFileEditor
          files={files}
          activeFile={activeFile}
          onFilesChange={setFiles}
        />
      </div>

      <div className="bg-[#2a2a2a] rounded-xl p-4 h-[200px]">
        <p className="text-sm text-white">Terminal</p>
        {/* Terminal Output */}
      </div>
    </main>
  );
}
