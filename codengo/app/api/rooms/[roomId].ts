// // /api/rooms/[roomId].ts (or .js)
// import Room from "@/models/Room"; // your mongoose model
// import dbConnect from "@/lib/db";

// export default async function handler(req, res) {
//   await dbConnect();
//   const { roomId } = req.query;

//   try {
//     const room = await Room.findOne({ roomId });
//     if (!room) return res.status(404).json({ message: "Room not found" });

//     res.status(200).json({ room });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// }
