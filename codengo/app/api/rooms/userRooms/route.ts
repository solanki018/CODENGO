import { connectDB } from "@/app/dbconfig/dbconfig";
import Room from "@/app/models/roomModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID missing" }, { status: 400 });
  }

  try {
    const rooms = await Room.find({ creator: userId });
    return NextResponse.json({ rooms }, { status: 200 });
  } catch (err) {
    console.error("❌ Failed to fetch rooms:", err);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}
