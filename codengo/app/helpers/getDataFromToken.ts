import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (req: NextRequest) => {
    try {
        const token = req.cookies.get("token")?.value ||
        "";
        const decodedtoken:any =  jwt.verify(token, process.env.TOKEN_SECRET! as string);
        return decodedtoken.id
    } catch (error) {
        return null;
    }
}

