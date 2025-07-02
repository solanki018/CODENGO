// File: app/api/files/[roomId]/route.ts

import { connectDB } from "@/app/dbconfig/dbconfig";
import File from "@/app/models/fileModel";
import { NextRequest, NextResponse } from "next/server";
import type { PagesRouteHandlerContext } from "next/dist/server/route-modules/pages/module.compiled";


type Props = {
  params: Promise<{ roomId: string }>;
};

export async function GET(req: NextRequest, props: Props) {
  const { roomId } = await props.params;
  try {
    await connectDB();

    const files = await File.find({ roomId }).select("filename content roomId createdAt");

    return NextResponse.json({ files }, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/files/[roomId]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
