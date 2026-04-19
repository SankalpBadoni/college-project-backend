import mongoose from "mongoose";

const facultySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    bio: { type: String, trim: true },
    expertise: [{ type: String, trim: true }],
    experienceYears: { type: Number, default: 0 },
    completedPrograms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Program" }]
  },
  { timestamps: true }
);

const Faculty = mongoose.model("Faculty", facultySchema);
export default Faculty;
