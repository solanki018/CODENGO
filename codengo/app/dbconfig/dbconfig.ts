import mongoose from "mongoose";


export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        const connection = mongoose.connection;
        connection.on("error", (error) => {
            console.error("MongoDB connection error:", error);
            process.exit();
        });
        connection.on("connected", () => {
            console.log("MongoDB connected successfully");
        }
        );
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}
