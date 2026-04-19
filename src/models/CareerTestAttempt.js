import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionIndex: { type: Number, required: true },
    selectedOptionIndex: { type: Number, required: true }
  },
  { _id: false }
);

const careerTestAttemptSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    template: { type: mongoose.Schema.Types.ObjectId, ref: "CareerTestTemplate", required: true },
    answers: { type: [answerSchema], default: [] },
    competencyScores: {
      type: Map,
      of: Number,
      default: {}
    },
    spiderWebData: {
      labels: [{ type: String }],
      values: [{ type: Number }]
    }
  },
  { timestamps: true }
);

const CareerTestAttempt = mongoose.model("CareerTestAttempt", careerTestAttemptSchema);
export default CareerTestAttempt;
