// File: app/api/rooms/[roomId]/route.ts
import { connectDB } from "@/app/dbconfig/dbconfig";
import Room from "@/app/models/roomModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    await connectDB();

    const { roomId } = params;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ room }, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/rooms/[roomId]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


