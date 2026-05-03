import mongoose from "mongoose";

const courseModuleSchema = new mongoose.Schema(
  {
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
    title: { type: String, required: true, trim: true },
    objectives: [{ type: String, trim: true }],
    content: { type: String, trim: true },
    introVideoUrl: { type: String, trim: true },
    lessonHighlights: [{ type: String, trim: true }],
    videoLessons: [
      {
        title: { type: String, trim: true },
        videoUrl: { type: String, trim: true },
        durationMinutes: { type: Number, min: 0 },
        summary: { type: String, trim: true }
      }
    ],
    readingMaterials: [
      {
        title: { type: String, trim: true },
        url: { type: String, trim: true },
        fileType: { type: String, enum: ["pdf", "ppt", "doc", "link", "other"], default: "other" }
      }
    ],
    examples: [
      {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        referenceUrl: { type: String, trim: true }
      }
    ],
    interactiveElements: [
      {
        type: { type: String, enum: ["quiz", "poll", "flashcard", "discussion", "exercise"], default: "quiz" },
        label: { type: String, trim: true },
        url: { type: String, trim: true }
      }
    ],
    assessments: [
      {
        title: { type: String, trim: true },
        kind: { type: String, enum: ["pre", "mid", "post", "assignment", "project"], default: "mid" },
        url: { type: String, trim: true }
      }
    ],
    capstoneProject: {
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      deliverable: { type: String, trim: true },
      evaluationCriteria: [{ type: String, trim: true }]
    },
    order: { type: Number, default: 0, min: 0 },
    isAdditionalContent: { type: Boolean, default: false },
    visualElements: {
      coverImageUrl: { type: String, trim: true },
      thumbnailUrl: { type: String, trim: true },
      illustrationUrl: { type: String, trim: true },
      accentColor: { type: String, trim: true }
    },
    parentModule: { type: mongoose.Schema.Types.ObjectId, ref: "CourseModule" }
  },
  { timestamps: true }
);

const CourseModule = mongoose.model("CourseModule", courseModuleSchema);
export default CourseModule;