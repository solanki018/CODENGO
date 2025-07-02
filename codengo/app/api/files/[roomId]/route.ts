// File: app/api/files/[roomId]/route.ts

import { connectDB } from "@/app/dbconfig/dbconfig";
import File from "@/app/models/fileModel";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  try {
    await connectDB();

    const files = await File.find({ roomId }).select("filename content roomId createdAt");

    return NextResponse.json({ files }, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/files/[roomId]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
