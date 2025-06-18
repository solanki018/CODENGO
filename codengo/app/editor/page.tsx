'use client';

import { useEffect, useRef, useState } from 'react';
import MultiFileEditor from '../components/editor';

type File = {
  filename: string;
  content: string;
};

export default function CollaborativeEditor() {
  const [files, setFiles] = useState<File[]>([
    {
      filename: 'main.cpp',
      content: `#include <iostream>\nint main() {\n  std::cout << "Hello";\n  return 0;\n}`,
    },
  ]);
  const [activeFile, setActiveFile] = useState(0);
  const [output, setOutput] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const ws = useRef<WebSocket | null>(null);
  const selfUpdate = useRef(false);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:3001');

    ws.current.onopen = () => {
      setConnectionStatus('Connected');
    };

    ws.current.onclose = () => {
      setConnectionStatus('Disconnected');
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'update') {
        if (!selfUpdate.current) {
          try {
            const receivedFiles: File[] = JSON.parse(message.content);
            setFiles(receivedFiles);
          } catch (err) {
            console.warn('Failed to parse file content:', err);
          }
        }
        selfUpdate.current = false;
      }
      if (message.type === 'result') {
        setOutput(message.output);
      }
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const handleFilesChange = (updatedFiles: File[]) => {
    setFiles(updatedFiles);
    selfUpdate.current = true;
    ws.current?.send(JSON.stringify(updatedFiles));
  };

  const handleRun = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: 'run',
          language: files[activeFile].filename.endsWith('.cpp') ? 'cpp' : 'python',
          code: files[activeFile].content,
        })
      );
    }
  };

  const handleTabClick = (idx: number) => setActiveFile(idx);

  return (
    <div className="h-screen w-screen p-4 bg-gray-900 text-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Collaborative Code Editor</h2>
        <span
          className={`text-sm px-2 py-1 rounded ${
            connectionStatus === 'Connected'
              ? 'bg-green-800 text-green-200'
              : 'bg-red-800 text-red-200'
          }`}
        >
          {connectionStatus}
        </span>
      </div>

      {/* File Tabs */}
      <div className="flex space-x-2 mb-2">
        {files.map((file, idx) => (
          <button
            key={file.filename}
            className={`px-3 py-1 rounded-t transition-colors ${
              idx === activeFile
                ? 'bg-gray-800 border-t border-l border-r border-gray-700 font-bold text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => handleTabClick(idx)}
          >
            {file.filename}
          </button>
        ))}
      </div>

      {/* Editor Panel */}
      <div className="bg-gray-800 rounded shadow p-4 mb-4 border border-gray-700">
        <MultiFileEditor
          initialFiles={[files[activeFile]]}
          onFilesChange={(updated) => {
            const newFiles = [...files];
            newFiles[activeFile] = updated[0];
            handleFilesChange(newFiles);
          }}
        />
      </div>

      {/* Toolbar */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={handleRun}
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Run
        </button>
        {/* Add more toolbar actions here */}
      </div>

      {/* Output Panel */}
      <div className="bg-black text-green-300 rounded p-4 min-h-[80px] font-mono border border-gray-700">
        <div className="font-bold mb-1">Output:</div>
        <pre className="whitespace-pre-wrap">{output || 'No output yet.'}</pre>
      </div>
    </div>
  );
}