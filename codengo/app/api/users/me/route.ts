import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/app/models/userModel";
import { connectDB } from "@/app/dbconfig/dbconfig";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET!);

    const user = await User.findById(decoded.id).select("-password"); // don't return password

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



// const tokenData = {
//   id: user._id,
//   username: user.username,
//   email: user.email,
//   phone: user.phone,
//   about: user.about,
// };