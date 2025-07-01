"use client";

import { ReactNode, useMemo } from "react";
import { RoomProvider } from "@liveblocks/react/suspense";
import { useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import { ClientSideSuspense, LiveblocksProvider } from "@liveblocks/react";
import { Loading } from "./components/editorComps/Loading";
import { RoomFileProvider as CustomRoomContext } from "./RoomContext"; 
import { LiveList } from "@liveblocks/core";


export function Room({ children }: { children: ReactNode }) {

  // get roomid from wherever and use here
  // const roomId = useExampleRoomId("testroom");
  const params = useParams();
  const roomId = params?.roomId as string; // 👈 dynamic route param

  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
        }}
        initialStorage={{
          files: new LiveList([]),
        }}
      >
        <CustomRoomContext>
          <ClientSideSuspense fallback={<Loading />}>
            {children}
          </ClientSideSuspense>
        </CustomRoomContext>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

/**
 * This function is used when deploying an example on liveblocks.io.
 * You can ignore it completely if you run the example locally.
 */
function useExampleRoomId(roomId: string) {
  const params = useSearchParams();
  const exampleId = params?.get("exampleId");

  const exampleRoomId = useMemo(() => {
    return exampleId ? `${roomId}-${exampleId}` : roomId;
  }, [roomId, exampleId]);

  return exampleRoomId;
}
