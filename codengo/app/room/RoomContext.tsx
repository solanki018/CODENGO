import React, { createContext, useContext, useState } from "react";

type File = {
  filename: string;
  content: string;
};

type RoomContextType = {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  activeFile: number;
  setActiveFile: React.Dispatch<React.SetStateAction<number>>;
  output: string;
  setOutput: React.Dispatch<React.SetStateAction<string>>;
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const useRoomContext = () => {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error("useRoomContext must be used within RoomProvider");
  return ctx;
};

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const [files, setFiles] = useState<File[]>([
    {
      filename: "main.cpp",
      content: `#include <iostream>\nint main() {\n  std::cout << "Hello, world!";\n  return 0;\n}`,
    },
    {
      filename: "utils.h",
      content: `void greet() {\n  std::cout << "Hi!";\n}`,
    },
  ]);
  const [activeFile, setActiveFile] = useState(0);
  const [output, setOutput] = useState("");

  return (
    <RoomContext.Provider
      value={{ files, setFiles, activeFile, setActiveFile, output, setOutput }}
    >
      {children}
    </RoomContext.Provider>
  );
};