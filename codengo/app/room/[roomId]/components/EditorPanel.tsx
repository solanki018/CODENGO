"use client";

import { useRoomFiles } from "../RoomContext";
import CollaborativeEditor from "./editorComps/CollaborativeEditor";
import { useState, useRef } from "react";

export default function EditorPanel() {
  const { files, activeFile } = useRoomFiles();
  const [terminalOutput, setTerminalOutput] = useState<string>("");
  const editorRef = useRef<() => string>(() => ""); // will be set by CollaborativeEditor

  if (files.length === 0 || !files[activeFile]) {
    return (
      <div className="flex-grow flex items-center justify-center text-gray-500">
        <p>Select a file to edit</p>
      </div>
    );
  }

  const currentFile = files[activeFile];

  const handleRunCode = async () => {
  try {
    const res = await fetch("/api/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: editorRef.current ? editorRef.current() : "",
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setTerminalOutput(data.output);
    } else {
      setTerminalOutput(`❌ Error: ${data.error || "Something went wrong"}`);
    }
  } catch (err) {
    console.error(err);
    setTerminalOutput("❌ Failed to run code.");
  }
};


  return (
    <div className="flex-grow flex flex-col bg-[#1e1e1e] rounded-2xl overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2a2a2a] border-b border-zinc-700">
        <div className="text-sm text-zinc-300">
          Editing: <span className="font-medium text-white">{currentFile.filename}</span>
        </div>
        <button
          onClick={handleRunCode}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded-md text-sm text-white font-semibold"
        >
          ▶ Run
        </button>
      </div>

      {/* Editor and Terminal */}
      <div className="flex-1 flex flex-col">
        <div className="flex-grow flex flex-col overflow-hidden">
          <CollaborativeEditor
            key={currentFile.filename}
            filename={currentFile.filename}
            getCodeRef={editorRef}
          />
        </div>

        {/* Terminal output */}
        <div className="h-40 bg-[#111111] text-sm text-green-400 font-mono px-4 py-2 border-t border-zinc-700 overflow-auto">
          <div className="text-zinc-400 mb-1">Terminal:</div>
          <pre className="whitespace-pre-wrap">{terminalOutput || "No output yet..."}</pre>
        </div>
      </div>
    </div>
  );
}
