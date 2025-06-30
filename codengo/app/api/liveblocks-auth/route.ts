import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";

/**
 * Authenticating your Liveblocks application
 * https://liveblocks.io/docs/authentication
 */

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  
  // userid here from wherever
  const userId = Math.floor(Math.random() * 10) % USER_INFO.length;

  // Create a session for the current user
  // userInfo is made available in Liveblocks presence hooks, e.g. useOthers (default hai not needed)
  const session = liveblocks.prepareSession(`user-${userId}`, {
    userInfo: USER_INFO[userId],
  });

  // Use a naming pattern to allow access to rooms with a wildcard
  // for all rooms starting with prefix, use `testroom-*`, for like `testroom-1`, `testroom-2`, etc.
  // access types - session.READ_ACCESS, session.FULL_ACCESS
  session.allow("testroom", session.FULL_ACCESS);

  // Authorize the user and return the result
  const { body, status } = await session.authorize();
  return new Response(body, { status });

  // now onto Room.tsx for roomId
}k

const USER_INFO = [
  {
    name: "Charlie Layne",
    color: "#D583F0",
    picture: "https://liveblocks.io/avatars/avatar-1.png",
  },
  {
    name: "Mislav Abha",
    color: "#F08385",
    picture: "https://liveblocks.io/avatars/avatar-2.png",
  },
  {
    name: "Tatum Paolo",
    color: "#F0D885",
    picture: "https://liveblocks.io/avatars/avatar-3.png",
  },
  {
    name: "Anjali Wanda",
    color: "#85EED6",
    picture: "https://liveblocks.io/avatars/avatar-4.png",
  },
  {
    name: "Jody Hekla",
    color: "#85BBF0",
    picture: "https://liveblocks.io/avatars/avatar-5.png",
  },
  {
    name: "Emil Joyce",
    color: "#8594F0",
    picture: "https://liveblocks.io/avatars/avatar-6.png",
  },
  {
    name: "Jory Quispe",
    color: "#85DBF0",
    picture: "https://liveblocks.io/avatars/avatar-7.png",
  },
  {
    name: "Quinn Elton",
    color: "#87EE85",
    picture: "https://liveblocks.io/avatars/avatar-8.png",
  },
];
