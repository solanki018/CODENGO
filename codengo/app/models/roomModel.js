import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Room name
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  roomId: { type: String, required: true, unique: true }, // 6-character ID
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);
export default Room;
