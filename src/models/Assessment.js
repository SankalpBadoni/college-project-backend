import mongoose from "mongoose";

const assessmentQuestionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true, trim: true },
    maxMarks: { type: Number, default: 1, min: 0 },
    type: { type: String, enum: ["mcq", "short_answer", "assignment", "project"], default: "mcq" }
  },
  { _id: false }
);

const assessmentSchema = new mongoose.Schema(
  {
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
    title: { type: String, required: true, trim: true },
    instructions: { type: String, trim: true },
    dueDate: { type: Date },
    maxMarks: { type: Number, default: 100, min: 0 },
    questions: { type: [assessmentQuestionSchema], default: [] },
    status: { type: String, enum: ["draft", "published", "closed"], default: "draft" }
  },
  { timestamps: true }
);

const Assessment = mongoose.model("Assessment", assessmentSchema);
export default Assessment;