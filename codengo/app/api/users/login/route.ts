import {connectDB} from "@/app/dbconfig/dbconfig";
import User from "@/app/models/userModel";
import { NextRequest,NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";



export async function POST(request :NextRequest) {
    try{
        
        await connectDB();
        const reqBody = await request.json();
        const {email,password} = reqBody;

        console.log(reqBody);

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 500 });
        }
        console.log("user exists");

        // Check password
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
        }
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET! as string, { expiresIn: "1d" } );
       const response = NextResponse.json({
            message: "Login successful",
            success :true,
       });
        response.cookies.set("token", token , {
            httpOnly: true,
        });
        
        // ✅ Return the response!
        return response;
        
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
