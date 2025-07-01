import { connectDB } from "@/app/dbconfig/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import Room from "@/app/models/roomModel";
import User from "@/app/models/userModel";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userId, roomName } = await req.json();

    if (!userId || !roomName) {
      return NextResponse.json({ error: "User ID and Room Name are required" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newRoom = await Room.create({
      name: roomName,
      creator: user._id,
      members: [user._id],
      roomId,
    });

    return NextResponse.json({ message: "Room created", roomId: newRoom.roomId });
  } catch (error: any) {
    console.error("❌ Error creating room:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
