import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import AssessmentQuestion from "./src/models/AssessmentQuestion.js";
import { communicationQuestions } from "./src/data/assessmentQuestionsData.js";

dotenv.config();

const seedCommunicationQuestions = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // We do NOT clear existing questions here.
    console.log("🔍 Checking for existing communication questions...");
    const existingCount = await AssessmentQuestion.countDocuments({ section: "communication" });

    if (existingCount > 0) {
      console.log(`⚠️  ${existingCount} questions already exist in communication section. Script stopped to avoid duplicates.`);
    } else {
      console.log("📝 Seeding 40 communication style pairs...");
      await AssessmentQuestion.insertMany(communicationQuestions);
      console.log("✅ Successfully added communication questions!");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding questions:", error);
    process.exit(1);
  }
};

seedCommunicationQuestions();