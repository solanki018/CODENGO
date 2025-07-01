"use client";

import * as Y from "yjs";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { useRoom } from "@liveblocks/react";
import { useCallback, useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import { Awareness } from "y-protocols/awareness";

export default function CollaborativeEditor({
  filename,
  getCodeRef,
}: {
  filename: string;
  getCodeRef: React.MutableRefObject<() => string>;
}) {
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();
  const room = useRoom();
  const yProvider = getYjsProviderForRoom(room);

  // Mount Monaco Binding
  useEffect(() => {
    let binding: MonacoBinding | undefined;

    if (editorRef) {
      const yDoc = yProvider.getYDoc();
      const yText = yDoc.getText(filename || "monaco");

      binding = new MonacoBinding(
        yText,
        editorRef.getModel() as editor.ITextModel,
        new Set([editorRef]),
        yProvider.awareness as unknown as Awareness
      );
    }

    return () => {
      binding?.destroy();
    };
  }, [editorRef, room, filename]);

  // Register code retriever
  useEffect(() => {
    if (editorRef) {
      getCodeRef.current = () => editorRef.getValue();
    }
  }, [editorRef, getCodeRef]);

  const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
    setEditorRef(e);
  }, []);

  return (
    <div className="flex-grow p-4 rounded-2xl bg-[#1a1a1a]">
      <Editor
        onMount={handleOnMount}
        height="100%"
        width="100%"
        theme="vs-dark"
        defaultLanguage="typescript"
        defaultValue=""
        options={{ tabSize: 2 }}
      />
    </div>
  );
}
