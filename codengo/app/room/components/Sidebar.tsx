'use client';

import { FaPlus, FaDownload, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import { useRoomContext } from '../RoomContext';

export default function Sidebar() {
  const { files, setFiles, activeFile, setActiveFile } = useRoomContext();

  // Add new file with editable name
  const handleNewFile = () => {
    const newName = `file${files.length + 1}.cpp`;
    setFiles([
      ...files,
      { filename: newName, content: '' }
    ]);
    setActiveFile(files.length); // Switch to new file
  };

  // Rename logic
  const handleNameChange = (idx: number, newName: string) => {
    setFiles(files.map((file, i) =>
      i === idx ? { ...file, filename: newName } : file
    ));
  };

  // Delete file
  const handleDelete = (idx: number) => {
    const newFiles = files.filter((_, i) => i !== idx);
    setFiles(newFiles);
    if (activeFile === idx) {
      setActiveFile(Math.max(0, idx - 1));
    } else if (activeFile > idx) {
      setActiveFile(activeFile - 1);
    }
  };

  return (
    <aside className="w-64 bg-[#1a1a1a] p-4 flex flex-col justify-between min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-white mb-8">
          CoDe<span className="text-purple-500">N</span>go
        </h1>

        <button
          onClick={handleNewFile}
          className="w-full bg-[#262626] text-white py-3 mb-4 rounded-md font-semibold hover:bg-[#333] flex items-center justify-center gap-2"
        >
          <FaPlus /> NEW FILE
        </button>

        {files.map((file, idx) => (
          <div
            key={file.filename + idx}
            className={`w-full bg-[#262626] py-2 px-3 mb-2 rounded-md text-sm flex justify-between items-center hover:bg-[#333] cursor-pointer ${
              idx === activeFile ? 'border-l-4 border-purple-500' : ''
            }`}
            onClick={() => setActiveFile(idx)}
          >
            <span
              className="truncate w-full"
              title={file.filename}
              contentEditable
              suppressContentEditableWarning
              onBlur={e => handleNameChange(idx, e.currentTarget.textContent || '')}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  (e.target as HTMLElement).blur();
                }
              }}
              spellCheck={false}
            >
              {file.filename}
            </span>
            <FaTrash
              className="text-red-500 hover:text-red-400 cursor-pointer ml-2"
              onClick={e => {
                e.stopPropagation();
                handleDelete(idx);
              }}
            />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <Link href="/room/excalidraw">
          <button className="w-full bg-white text-black py-2 rounded-md font-semibold hover:scale-105 transition">
            EXCALIDRAW
          </button>
        </Link>
        <button className="w-full bg-[#262626] text-white py-2 rounded-md font-semibold flex items-center justify-between px-4 hover:bg-[#333]">
          Project Name <FaDownload />
        </button>
      </div>
    </aside>
  );
}
