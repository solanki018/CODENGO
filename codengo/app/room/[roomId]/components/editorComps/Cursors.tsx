import { use, useEffect, useMemo, useState } from "react";
import { useSelf } from "@liveblocks/react/suspense";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";

type Props = {
  yProvider: LiveblocksYjsProvider;
};

type UserAwareness = {
  user: {
    name: string;
    color?: string;
    [key: string]: any;
  };
  [key: string]: any;
};

type AwarenessList = [number, UserAwareness][];

export function Cursors({ yProvider }: Props) {
  // Get user info from Liveblocks authentication endpoint

  const userInfo = useSelf((me) => me.info);
  console.log("userInfo", userInfo);

  const [awarenessUsers, setAwarenessUsers] = useState<AwarenessList>([]);

  useEffect(() => {
    // Add user info to Yjs awareness
    const localUser: UserAwareness["user"] = userInfo;
    yProvider.awareness.setLocalStateField("user", localUser);

    // On changes, update `awarenessUsers`
    function setUsers() {
      setAwarenessUsers([...yProvider.awareness.getStates()] as AwarenessList);
    }

    yProvider.awareness.on("change", setUsers);

    setUsers();

    return () => {
      yProvider.awareness.off("change", setUsers);
    };
  }, [yProvider]);

  // Insert awareness info into cursors with styles

  const styleSheet = useMemo(() => {
  let cursorStyles = "";

  for (const [clientId, client] of awarenessUsers) {
    if (client?.user) {
      const name = client.user.name || "Unknown";
      console.log("clientId", clientId, "name", name, "color", client.user.color);
      // ✅ Escape any double quotes to avoid CSS breakage
      const escapedName = name.replace(/"/g, '\\"');

      cursorStyles += `
  .yRemoteSelection-${clientId},
  .yRemoteSelectionHead-${clientId} {
    --user-color: ${client.user.color || "orangered"};
  }

  .yRemoteSelectionHead-${clientId} {
    position: relative;
  }

  .yRemoteSelectionHead-${clientId}::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 2px;
    height: 100%;
    background-color: var(--user-color);
    animation: blink 1.2s steps(2, start) infinite;
  }

  .yRemoteSelectionHead-${clientId}::after {
    content: "${escapedName}";
    position: absolute;
    top: -2em;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--user-color);
    color: white;
    padding: 2px 6px;
    font-size: 12px;
    font-weight: 500;
    border-radius: 4px;
    white-space: nowrap;
    z-index: 20;
    pointer-events: none;
  }
`;

    }
  }

  return { __html: cursorStyles };
}, [awarenessUsers]);

  return <style dangerouslySetInnerHTML={styleSheet} />;
}
