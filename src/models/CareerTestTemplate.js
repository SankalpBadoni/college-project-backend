import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true, trim: true },
    options: [
      {
        text: { type: String, required: true, trim: true },
        competencyWeights: {
          type: Map,
          of: Number,
          default: {}
        }
      }
    ]
  },
  { _id: false }
);

const careerTestTemplateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true },
    questions: { type: [questionSchema], default: [] }
  },
  { timestamps: true }
);

const CareerTestTemplate = mongoose.model("CareerTestTemplate", careerTestTemplateSchema);
export default CareerTestTemplate;
