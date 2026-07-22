import mongoose from "mongoose";

const universityDegreeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    durationYears: { type: Number, required: true, min: 1 }
  },
  { timestamps: true }
);

const UniversityDegree = mongoose.model("UniversityDegree", universityDegreeSchema);
export default UniversityDegree;
