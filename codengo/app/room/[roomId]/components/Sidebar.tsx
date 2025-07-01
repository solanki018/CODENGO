'use client';

import { FaPlus, FaDownload, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import { useRoomFiles } from '../RoomContext';

export default function Sidebar() {
  const {
    files,
    activeFile,
    setActiveFile,
    addFile,
    deleteFile
  } = useRoomFiles();

  const handleNewFile = () => {
    const baseName = 'file';
    const ext = '.cpp';
    let index = 1;

    // Ensure unique filename
    while (files.some((f) => f.filename === `${baseName}${index}${ext}`)) {
      index++;
    }

    const newName = `${baseName}${index}${ext}`;
    addFile(newName);
  };

  const handleDelete = (idx: number) => {
    const filename = files[idx].filename;
    deleteFile(filename);
  };

  return (
    <aside className="w-64 bg-[#1a1a1a] p-4 flex flex-col justify-between min-h-screen rounded-2xl">
      <div>
        {/* Logo */}
        <h1 className="text-3xl font-bold text-white mb-8">
          CoDe<span className="text-purple-500">N</span>go
        </h1>

        {/* New File Button */}
        <button
          onClick={handleNewFile}
          className="w-full bg-[#262626] text-white py-3 mb-4 rounded-md font-semibold hover:bg-[#333] flex items-center justify-center gap-2"
        >
          <FaPlus /> NEW FILE
        </button>

        {/* File List */}
        {files.map((file, idx) => (
          <div
            key={file.filename + idx}
            className={`w-full bg-[#262626] py-2 px-3 mb-2 rounded-md text-sm flex justify-between items-center hover:bg-[#333] cursor-pointer ${
              idx === activeFile ? 'border-l-4 border-purple-500' : ''
            }`}
            onClick={() => setActiveFile(idx)}
          >
            <span className="truncate w-full" title={file.filename}>
              {file.filename}
            </span>
            <FaTrash
              className="text-red-500 hover:text-red-400 cursor-pointer ml-2"
              onClick={(e) => {
                e.stopPropagation(); // Prevent file click
                handleDelete(idx);
              }}
            />
          </div>
        ))}
      </div>

      {/* Bottom Buttons */}
      <div className="space-y-3">
        <Link href="/room/excalidraw">
          <button className="w-full bg-white text-black py-2 rounded-md font-semibold hover:scale-105 transition">
            EXCALIDRAW
          </button>
        </Link>

        <button
          className="w-full bg-[#262626] text-white py-2 rounded-md font-semibold flex items-center justify-between px-4 hover:bg-[#333]"
          onClick={() => {
            alert("Download functionality is not implemented yet.");
            // You can integrate actual ZIP or file export logic here
          }}
        >
          Project Name <FaDownload />
        </button>
      </div>
    </aside>
  );
}
