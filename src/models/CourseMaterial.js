import mongoose from "mongoose";

const courseMaterialSchema = new mongoose.Schema(
  {
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    moduleName: { type: String, trim: true },
    fileUrl: { type: String, required: true, trim: true },
    fileType: { type: String, enum: ["pdf", "video", "link", "doc", "slides", "other"], default: "other" },
    visibility: { type: String, enum: ["students", "faculty", "public"], default: "students" },
    tags: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

const CourseMaterial = mongoose.model("CourseMaterial", courseMaterialSchema);
export default CourseMaterial;