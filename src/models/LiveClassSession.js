import mongoose from "mongoose";

const liveClassSessionSchema = new mongoose.Schema(
  {
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
    title: { type: String, required: true, trim: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    meetingLink: { type: String, trim: true },
    status: { type: String, enum: ["scheduled", "booked", "cancelled", "completed"], default: "scheduled" },
    slotCapacity: { type: Number, default: 1, min: 1 },
    bookedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    cancelledAt: { type: Date }
  },
  { timestamps: true }
);

const LiveClassSession = mongoose.model("LiveClassSession", liveClassSessionSchema);
export default LiveClassSession;