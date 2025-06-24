'use client';

import { useEffect } from 'react';
import { useRoomContext } from '../RoomContext';
import MonacoEditor from '@monaco-editor/react';

const languageFromFilename = (filename: string): string => {
  if (filename.endsWith('.cpp')) return 'cpp';
  if (filename.endsWith('.py')) return 'python';
  if (filename.endsWith('.js')) return 'javascript';
  if (filename.endsWith('.ts')) return 'typescript';
  if (filename.endsWith('.html')) return 'html';
  if (filename.endsWith('.css')) return 'css';
  return 'plaintext';
};

export default function Editor() {
  const { files, setFiles, activeFile, userId } = useRoomContext();

  if (files.length === 0) {
    return (
      <main className="flex-1 p-6 flex flex-col gap-6 items-center justify-center text-gray-400">
        <p className="text-lg">No file open</p>
        <p className="text-sm">Create a file and start editing</p>
      </main>
    );
  }
  
  useEffect(() => {
    const file = files[activeFile];
    if (!file?.doc) return;

    const handleOp = () => {
      setFiles(prev => {
        const updated = [...prev];
        updated[activeFile] = { ...updated[activeFile], content: file.doc.data };
        return updated;
      });
    };

    file.doc.on('op', handleOp);
    return () => file.doc.off('op', handleOp);
  }, [files, activeFile, setFiles]);

  const handleEditorChange = (value: string | undefined) => {
    const file = files[activeFile];
    if (!file?.doc) return;

    const old = file.content;
    const updated = value || '';
    const op = [{ p: [0], d: old }, { p: [0], i: updated }];

    file.doc.submitOp(op, { source: userId });
  };

  return (
    <main className="flex-1 p-6 flex flex-col gap-6">
      <div className="flex-1 min-h-0 bg-[#2a2a2a] rounded-xl p-0 overflow-hidden">
        <div className="w-full h-full flex flex-col">
          <div className="flex-1 min-h-0">
            <MonacoEditor
              height="100%"
              language={languageFromFilename(files[activeFile].filename)}
              value={files[activeFile].content}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                fontSize: 14,
                automaticLayout: true,
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-[#2a2a2a] rounded-xl p-4 h-[200px]">
        <p className="text-sm text-white">Terminal</p>
      </div>
    </main>
  );
}
