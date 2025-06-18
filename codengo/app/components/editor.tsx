import React, { useEffect } from "react";
import Editor from "@monaco-editor/react";

type File = {
  filename: string;
  content: string;
};

type Props = {
  files: File[];
  activeFile: number;
  onFilesChange: (files: File[]) => void;
};

const languageFromFilename = (filename: string): string => {
  if (filename.endsWith(".cpp")) return "cpp";
  if (filename.endsWith(".py")) return "python";
  if (filename.endsWith(".js")) return "javascript";
  if (filename.endsWith(".ts")) return "typescript";
  if (filename.endsWith(".html")) return "html";
  if (filename.endsWith(".css")) return "css";
  return "plaintext";
};

const MultiFileEditor: React.FC<Props> = ({ files, activeFile, onFilesChange }) => {
  const handleEditorChange = (value: string | undefined) => {
    const updated = [...files];
    updated[activeFile].content = value || "";
    onFilesChange(updated);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <Editor
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
  );
};

export default MultiFileEditor;
