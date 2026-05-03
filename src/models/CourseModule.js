import mongoose from "mongoose";

const courseModuleSchema = new mongoose.Schema(
  {
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, trim: true },
    order: { type: Number, default: 0, min: 0 },
    isAdditionalContent: { type: Boolean, default: false },
    parentModule: { type: mongoose.Schema.Types.ObjectId, ref: "CourseModule" }
  },
  { timestamps: true }
);

const CourseModule = mongoose.model("CourseModule", courseModuleSchema);
export default CourseModule;