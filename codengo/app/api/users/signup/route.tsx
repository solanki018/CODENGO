import {connectDB} from "@/app/dbconfig/dbconfig";
import User from "@/app/models/userModel";
import { NextRequest,NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/app/helpers/mailer";
// import sendEmail from "@/app/helpers/mailer";

// connectDB();

export async function POST(request: NextRequest) {
    await connectDB();
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;
        console.log("Request body:", reqBody);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const newUser = new User({
            username: email.split("@")[0],
            firstName: email.split("@")[0],
            email,
            password: hashedPassword,
            
        });
        const savedUser = await newUser.save();
        console.log("User created successfully:", savedUser);
        // Send verification email
        const emailResponse = await sendEmail({
            email,
            emailType: "verification",
            userId: savedUser._id,
        });
        return NextResponse.json(
            { message: "User created successfully",
                success: true,
                savedUser, },
        );

    }
    catch (error:any) {
        console.error("Error creating user:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}