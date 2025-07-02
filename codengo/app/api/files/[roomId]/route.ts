// File: app/api/files/[roomId]/route.ts

import { connectDB } from "@/app/dbconfig/dbconfig";
import File from "@/app/models/fileModel";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: {
    roomId: string;
  };
};

export async function GET(req: NextRequest, context: Context) {
  try {
    await connectDB();

    const { roomId } = context.params;

    const files = await File.find({ roomId }).select("filename content roomId createdAt");

    return NextResponse.json({ files }, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/files/[roomId]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
