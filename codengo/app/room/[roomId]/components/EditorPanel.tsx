"use client";

import { useRoomFiles } from "../RoomContext";
import CollaborativeEditor from "./editorComps/CollaborativeEditor"; // assumes your editor component is here

export default function EditorPanel() {
  const { files, activeFile, setActiveFile, addFile, deleteFile } = useRoomFiles();
  console.log("Active file index:", activeFile);

  if (!activeFile) {
    return (
      <div className="flex-grow flex items-center justify-center text-gray-500">
        <p>Select a file to edit</p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col rounded-2xl overflow-hidden">
        <CollaborativeEditor 
            key={files[activeFile].filename}
            filename={files[activeFile].filename} 
        />
    </div>
  );
}
