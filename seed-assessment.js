/**
 * Seed Assessment Questions into Database
 * Run: node seed-assessment.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import AssessmentQuestion from "./src/models/AssessmentQuestion.js";
import { assessmentQuestions } from "./src/data/assessmentQuestionsData.js";

dotenv.config();

const seedAssessmentQuestions = async () => {
  try {
    // Connect to MongoDB
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing questions
    console.log("🗑️ Clearing existing assessment questions...");
    await AssessmentQuestion.deleteMany({});
    console.log("✅ Cleared existing questions");

    // Insert new questions
    console.log("📝 Seeding assessment questions...");
    const insertedQuestions = await AssessmentQuestion.insertMany(
      assessmentQuestions
    );
    console.log(
      `✅ Successfully seeded ${insertedQuestions.length} questions`
    );

    // Log summary
    console.log("\n📊 Seed Summary:");
    const strengthQuestions = await AssessmentQuestion.countDocuments({
      section: "strengths",
    });
    const weaknessQuestions = await AssessmentQuestion.countDocuments({
      section: "weaknesses",
    });

    console.log(`   Strength Questions: ${strengthQuestions}`);
    console.log(`   Weakness Questions: ${weaknessQuestions}`);
    console.log(
      `   Total Questions: ${strengthQuestions + weaknessQuestions}`
    );

    console.log("\n✨ Assessment questions seeded successfully!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding assessment questions:", error);
    process.exit(1);
  }
};

// Run the seed
seedAssessmentQuestions();
