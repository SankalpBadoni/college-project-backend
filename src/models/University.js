import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true }
  }
);

const universitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    branches: { type: [branchSchema], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId }, // ObjectId of the user who added it
    verified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Text index for dropdown search
universitySchema.index({ name: "text" });

const University = mongoose.model("University", universitySchema);
export default University;
