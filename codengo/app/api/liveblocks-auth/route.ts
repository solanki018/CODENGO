import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/app/models/userModel";

/**
 * Authenticating your Liveblocks application
 * https://liveblocks.io/docs/authentication
 */

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

// export async function POST(request: NextRequest) {
  
//   // userid here from wherever
//   const userId = Math.floor(Math.random() * 10) % USER_INFO.length;

//   // Create a session for the current user
//   // userInfo is made available in Liveblocks presence hooks, e.g. useOthers (default hai not needed)
//   const session = liveblocks.prepareSession(`user-${userId}`, {
//     userInfo: USER_INFO[userId],
//   });

//   // Use a naming pattern to allow access to rooms with a wildcard
//   // for all rooms starting with prefix, use `testroom-*`, for like `testroom-1`, `testroom-2`, etc.
//   // access types - session.READ_ACCESS, session.FULL_ACCESS
//   session.allow("testroom", session.FULL_ACCESS);

//   // Authorize the user and return the result
//   const { body, status } = await session.authorize();
//   return new Response(body, { status });

//   // now onto Room.tsx for roomId
// }

export async function POST(request: NextRequest) {
  try {
    const { room } = await request.json(); // ⬅️ Get requested room from client
    if (!room) {
      return new Response(JSON.stringify({ error: "Room ID missing" }), { status: 400 });
    }

    const user = await getUserFromToken(request); // 🔐 Replace with actual auth logic

    const token = request.cookies.get("token")?.value;
    if (!token) throw new Error("Not authenticated");

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as {
      id: string;
      username: string;
    };

    if (!decoded || !decoded.id || !decoded.username) {
      throw new Error("Invalid token");
    }

    console.log("Decoded JWT:", decoded);

    const session = liveblocks.prepareSession(user._id.toString(), {
      userInfo: {
        name: decoded.username,
        picture: "", // optional
        color: generateUserColor(decoded.id), // optional
      },
    });

    console.log(generateUserColor(decoded.id));

    // // console user
    // console.log("Liveblocks Auth User:", {
    //   id: user._id,
    //   name: user.username || user.firstName || "Anonymous",
    //   picture: "", // optional
    //   color: "#85BBF0", // optional
    // });

    // ✅ Grant access to the exact requested room
    session.allow(room, session.FULL_ACCESS);

    const { body, status } = await session.authorize();
    return new Response(body, { status });
  } catch (err: any) {
    console.error("Liveblocks Auth Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 401 });
  }
}

export function generateUserColor(userId: string): string {
  // DJB2 hash function — simple and effective
  let hash = 5381;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 33) ^ userId.charCodeAt(i);
  }

  // Generate hue from 0 to 359
  const hue = Math.abs(hash) % 360;

  // Fixed saturation and lightness for decent readability
  return `hsl(${hue}, 70%, 60%)`;
}


// Dummy implementation of getUserFromToken
async function getUserFromToken(request: NextRequest): Promise<{
  _id: string;
  firstName?: string;
  username?: string;
}> {
  // Replace this with your actual authentication logic
  return {
    _id: "1",
    firstName: "Demo",
    username: "demoUser"
  };
}


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
]
