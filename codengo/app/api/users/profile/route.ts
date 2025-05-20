import {connectDB} from "@/app/dbconfig/dbconfig";
import User from "@/app/models/userModel";
import { NextRequest,NextResponse } from "next/server";
import { getDataFromToken } from "@/app/helpers/detDataFromToken";

connectDB();

export async function POST(request:NextRequest) {
   const userId  = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select("-password");
    return NextResponse.json({
        message: "User profile fetched successfully",
        data: user,
    });
} 