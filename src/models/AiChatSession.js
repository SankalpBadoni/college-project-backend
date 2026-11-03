import mongoose from "mongoose";

/**
 * A single recommendation surfaced by SensAI inside an assistant message.
 * itemType maps to a real catalog entity the student can open:
 *   - "course"     -> Program (type: course | live_course)  -> /student/courses/:id
 *   - "project"    -> LiveProject                            -> /student/live-projects/:id
 *   - "internship" -> JobPosting (postingType: internship)   -> /student/jobs/:id
 *   - "job"        -> JobPosting (postingType: job)          -> /student/jobs/:id
 */
const recommendationSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: ["course", "project", "internship", "job"],
      required: true
    },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, trim: true },
    reason: { type: String, trim: true }
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "assistant", "system"], required: true },
    content: { type: String, default: "" },
    recommendations: { type: [recommendationSchema], default: [] },
    // Opening messages of a new conversation (revealed one by one on the client)
    intro: { type: Boolean, default: false },
    // Clickable choices shown under an intro message
    options: {
      type: [{ key: { type: String, trim: true }, label: { type: String, trim: true }, _id: false }],
      default: []
    },
    reported: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const aiChatSessionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    title: { type: String, trim: true, default: "New conversation" },
    messages: { type: [messageSchema], default: [] },
    lastMessageAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

aiChatSessionSchema.index({ student: 1, lastMessageAt: -1 });

const AiChatSession = mongoose.model("AiChatSession", aiChatSessionSchema);
export default AiChatSession;
