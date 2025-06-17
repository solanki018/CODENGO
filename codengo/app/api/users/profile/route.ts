import { NextResponse } from "next/server";
import {connectDB} from "../../../dbconfig/dbconfig"; // your DB connection
// Update the import path below if your userModel file is not at src/models/userModel.ts
import User from "../../../models/userModel"; // your Mongoose model

export async function PUT(req: Request) {
  await connectDB();
  const body = await req.json();

  const { email, name, username, phone, about, techStack } = body;

  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { name, username, phone, about, techStack },
      { new: true }
    );

    return NextResponse.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
