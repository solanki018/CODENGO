// app/api/users/profile/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/dbconfig/dbconfig";
import User from "@/app/models/userModel";
import jwt from "jsonwebtoken";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    const body = await req.json();

    // Update only allowed editable fields
    const { name, phone, about, techStack, profileImage } = body;

const updatedUser = await User.findByIdAndUpdate(
  decoded.id,
  {
    ...(name && { name }),
    ...(phone && { phone }),
    ...(about && { about }),
    ...(techStack && { techStack }),
    ...(profileImage && { profileImage }),
  },
  { new: true }
).select("-password");


    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated", user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
