import mongoose from "mongoose";

const facultyRatingSchema = new mongoose.Schema(
  {
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true }
  },
  { timestamps: true }
);

facultyRatingSchema.index({ faculty: 1, student: 1 }, { unique: true });

const FacultyRating = mongoose.model("FacultyRating", facultyRatingSchema);
export default FacultyRating;