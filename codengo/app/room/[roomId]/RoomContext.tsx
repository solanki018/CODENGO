"use client";

import { useStorage, useMutation, useSelf, useRoom } from "@liveblocks/react";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import React, { createContext, useEffect, useContext, useState, ReactNode } from "react";
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
  isStorageReady: boolean;
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
  const [isStorageReady, setStorageReady] = useState(false);

  // Track storage readiness
  useEffect(() => {
    if (files !== undefined) {
      setStorageReady(true);
    }
  }, [files]);

  // Mutation: Add a file
  const addFile = useMutation(({ storage }, name: string) => {
    const list = storage.get("files");

    if (!(list instanceof LiveList)) return;

    const exists = list.toArray().some(
      (file) =>
        typeof file === "object" &&
        file !== null &&
        "filename" in file &&
        (file as FileTab).filename === name
    );

    if (!exists) {
      list.push({ filename: name });
    }
  }, []);

  // Mutation: Delete a file
  const deleteFile = useMutation(({ storage }, name: string) => {
    const list = storage.get("files");

    if (!(list instanceof LiveList)) return;

    const index = list.findIndex(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "filename" in item &&
        (item as FileTab).filename === name
    );

    if (index !== -1) {
      list.delete(index);
    }
    
    const ydoc = getYjsProviderForRoom(room).getYDoc();
    const yText = ydoc.getText(name);
    yText.delete(0, yText.length);
  }, []);

  if (!room || files === undefined) return null;

  return (
    <RoomFileContext.Provider
      value={{
        files: files ?? [],
        activeFile,
        setActiveFile,
        addFile: isStorageReady ? addFile : () => {}, // Prevent calling early
        deleteFile: isStorageReady ? deleteFile : () => {},
        isStorageReady,
      }}
    >
      {children}
    </RoomFileContext.Provider>
  );
}
