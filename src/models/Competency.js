import mongoose from "mongoose";

const subCompetencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
  },
  { _id: true } // We keep _id here in case you want to tag sub-competencies later
);

// 1. Industry Schema
const industrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true }, // e.g., "IT & Technology"
  },
  { timestamps: true }
);

// 2. Domain Schema
const domainSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g., "Data Science"
    industry: { type: mongoose.Schema.Types.ObjectId, ref: "Industry", required: true },
  },
  { timestamps: true }
);

// 3. Competency Schema
const competencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g., "Data Visualization"
    type: { type: String, enum: ["technical", "behavioral"], required: true },
    
    // Parent references
    domain: { type: mongoose.Schema.Types.ObjectId, ref: "Domain", required: true },
    industry: { type: mongoose.Schema.Types.ObjectId, ref: "Industry", required: true },
    
    subCompetencies: { type: [subCompetencySchema], default: [] }
  },
  { timestamps: true }
);

export const Industry = mongoose.model("Industry", industrySchema);
export const Domain = mongoose.model("Domain", domainSchema);
export const Competency = mongoose.model("Competency", competencySchema);