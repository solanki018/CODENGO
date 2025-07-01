import { NextRequest, NextResponse } from "next/server";
import { executeCpp } from "@/app/room/[roomId]/utils/executeCode";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const output = await executeCpp(code);
    return NextResponse.json({ output });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Execution failed" },
      { status: 500 }
    );
  }
}
