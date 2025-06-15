'use client';

import { useState } from 'react';
import { FaPlus, FaDownload, FaTrash } from 'react-icons/fa';
import Link from 'next/link';

export default function Sidebar() {
  const [files, setFiles] = useState([
    { id: 1, name: 'File 1', isEditing: false },
    { id: 2, name: 'File 2', isEditing: false },
  ]);
  const [newFileName, setNewFileName] = useState('');

  // Add new file with editable name
  const handleNewFile = () => {
    const nextId = files.length ? files[files.length - 1].id + 1 : 1;
    setFiles([...files, { id: nextId, name: '', isEditing: true }]);
  };

  // Rename logic
  const handleNameChange = (id: number, newName: string) => {
    setFiles(files.map(file =>
      file.id === id ? { ...file, name: newName } : file
    ));
  };

  const handleSaveRename = (id: number) => {
    setFiles(files.map(file =>
      file.id === id ? { ...file, isEditing: false } : file
    ));
  };

  const handleDoubleClick = (id: number) => {
    setFiles(files.map(file =>
      file.id === id ? { ...file, isEditing: true } : file
    ));
  };

  const handleDelete = (id: number) => {
    setFiles(files.filter(file => file.id !== id));
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

        {files.map((file) => (
          <div
            key={file.id}
            className="w-full bg-[#262626] py-2 px-3 mb-2 rounded-md text-sm text-white flex justify-between items-center hover:bg-[#333]"
          >
            {file.isEditing ? (
              <input
                autoFocus
                value={file.name}
                onChange={(e) => handleNameChange(file.id, e.target.value)}
                onBlur={() => handleSaveRename(file.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveRename(file.id);
                }}
                className="bg-transparent border-none outline-none w-full text-white placeholder-white/50"
                placeholder="Enter file name"
              />
            ) : (
              <span
                className="truncate w-full cursor-pointer"
                onDoubleClick={() => handleDoubleClick(file.id)}
                title={file.name}
              >
                {file.name || 'Unnamed File'}
              </span>
            )}
            <FaTrash
              className="text-red-500 hover:text-red-400 cursor-pointer ml-2"
              onClick={() => handleDelete(file.id)}
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
