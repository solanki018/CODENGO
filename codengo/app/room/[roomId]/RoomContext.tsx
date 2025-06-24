import React, { createContext, useContext, useState } from "react";
import type { Doc } from 'sharedb';

type File = {
  filename: string;
  content: string;
  doc: Doc;
};

type RoomContextType = {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  activeFile: number;
  setActiveFile: React.Dispatch<React.SetStateAction<number>>;
  output: string;
  setOutput: React.Dispatch<React.SetStateAction<string>>;
  userId: string;
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const useRoomContext = () => {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error("useRoomContext must be used within RoomProvider");
  return ctx;
};

export const RoomProvider = ({ children, roomId }: { children: React.ReactNode; roomId: string; }) => {
  const [files, setFiles] = useState<File[]>([
    {
      filename: "hello.py",
      content: "# Welcome to your collaborative editor!\nprint('Hello, world!')",
      doc: null as unknown as Doc, // will be replaced when real doc is attached
    }
  ]);
  const [activeFile, setActiveFile] = useState(0);
  const [output, setOutput] = useState("");

  const userId = 'hihi';

  return (
    <RoomContext.Provider
      value={{ files, setFiles, activeFile, setActiveFile, output, setOutput, userId }}
    >
      {children}
    </RoomContext.Provider>
  );
};