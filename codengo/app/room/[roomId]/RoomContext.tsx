// RoomFileContext.tsx
"use client";

import { useStorage, useMutation, useSelf, useRoom } from "@liveblocks/react";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { LiveList } from "@liveblocks/core";

export type FileTab = {
  filename: string;
};

type RoomFileContextType = {
  files: FileTab[];
  activeFile: number;
  setActiveFile: React.Dispatch<React.SetStateAction<number>>;
  addFile: (filename: string) => void;
  deleteFile: (filename: string) => void;
};

const RoomFileContext = createContext<RoomFileContextType | undefined>(undefined);

export const useRoomFiles = () => {
  const ctx = useContext(RoomFileContext);
  if (!ctx) throw new Error("useRoomFiles must be used inside RoomFileProvider");
  return ctx;
};

export const RoomFileProvider = ({ children }: { children: React.ReactNode }) => {
  // const [files, setFiles] = useState<FileTab[]>([{ filename: "main.cpp" }]);
  const files = useStorage((root) => root.files as FileTab[] || []);
  const room = useRoom();


  const [activeFile, setActiveFile] = useState(0);

  const addFile = useMutation(({ storage }, name: string) => {
    const list = storage.get("files");
    console.log("Adding file:", name);
    if (!(list instanceof LiveList)) {
      console.error("Files is not a LiveList");
      return;
    }
    console.log("Current files:", list.toArray());
    if (list && !list.toArray().includes({ filename: name })) {
      list.push({ filename: name });
      console.log("File added:", name);
    }
  }, []);

  const deleteFile = useMutation(({ storage }, name: string) => {
    console.log("Deleting file:", name);
    const list = storage.get("files");
    console.log("Current files:", list);
    if (!(list instanceof LiveList)) {
      console.error("Files is not a LiveList");
      return;
    }

    const index = list.findIndex(
      (item) => item && typeof item === "object" && "filename" in item && item.filename === name
    );
    console.log("Index of file to delete:", index);
    if (index !== -1) {
      list.delete(index);
    }
    
    const ydoc = getYjsProviderForRoom(room).getYDoc();
    const yText = ydoc.getText(name);
    yText.delete(0, yText.length);
  }, []);


  return (
    <RoomFileContext.Provider value={{ files: files ?? [], activeFile, setActiveFile, addFile, deleteFile }}>
      {children}
    </RoomFileContext.Provider>
  );
};
