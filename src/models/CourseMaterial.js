import mongoose from "mongoose";

const courseMaterialSchema = new mongoose.Schema(
  {
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
    module: { type: mongoose.Schema.Types.ObjectId, ref: "CourseModule" },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    moduleName: { type: String, trim: true },
    fileUrl: { type: String, required: true, trim: true },
    fileType: { type: String, enum: ["pdf", "ppt", "video", "link", "doc", "slides", "infographic_static", "infographic_animated", "assessment", "quiz", "assignment", "live_project", "live_class", "youtube", "other"], default: "other" },
    phase: { type: String, enum: ["pre", "mid", "post", "ongoing"], default: "mid" },
    materialKind: { type: String, enum: ["ppt", "pdf", "infographic_static", "infographic_animated", "video", "live_project", "assessment", "quiz", "assignment", "notes", "live_class", "other"], default: "other" },
    assetStyle: { type: String, enum: ["static", "animated", "interactive", "document", "video", "live", "live_class"], default: "document" },
    dateTime: { type: Date },
    meetLink: { type: String, trim: true },
    isVisualRelief: { type: Boolean, default: false },
    visibility: { type: Array, default: ["students", "faculty", "public"] },
    visualElements: {
      previewImageUrl: { type: String, trim: true },
      thumbnailUrl: { type: String, trim: true },
      animationUrl: { type: String, trim: true }
    },
    tags: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

const CourseMaterial = mongoose.model("CourseMaterial", courseMaterialSchema);
export default CourseMaterial;