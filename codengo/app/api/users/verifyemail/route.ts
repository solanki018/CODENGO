import {connectDB} from "@/app/dbconfig/dbconfig";
import User from "@/app/models/userModel";
import { error } from "console";
import { NextRequest,NextResponse } from "next/server";


connectDB()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token } = reqBody;
        console.log(token);
        const user = await User.findOne({ verifytoken: token , verifyTokenExpiry: { $gt: Date.now() } });

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }
        console.log(user);
        user.isVerified = true;
        user.verifytoken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save()

          return NextResponse.json({
            message : "email verified successfully",
            success : true 
           }, { status: 500 });
    }catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}