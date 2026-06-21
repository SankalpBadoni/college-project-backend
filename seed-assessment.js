import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import AssessmentQuestion from "./src/models/AssessmentQuestion.js";

import {
  strengthsAssessmentQuestions,
  weaknessQuestions,
} from "./src/data/assessmentQuestionsData.js";

dotenv.config();

const seedAssessmentQuestions = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ Connected to MongoDB");

    console.log("🧹 Clearing existing strengths and weaknesses questions...");
    await AssessmentQuestion.deleteMany({
      section: { $in: ["strengths", "weaknesses"] },
    });
    console.log("✅ Cleared existing questions");

    // Merge both arrays
    const questions = [
      ...strengthsAssessmentQuestions,
      ...weaknessQuestions,
    ];

    console.log(`📝 Inserting ${questions.length} questions...`);

    const insertedQuestions =
      await AssessmentQuestion.insertMany(questions);

    console.log(
      `✅ Successfully inserted ${insertedQuestions.length} questions`
    );

    const strengthCount =
      await AssessmentQuestion.countDocuments({
        section: "strengths",
      });

    const weaknessCount =
      await AssessmentQuestion.countDocuments({
        section: "weaknesses",
      });

    console.log("\n📊 Summary:");
    console.log(`   Strength Questions: ${strengthCount}`);
    console.log(`   Weakness Questions: ${weaknessCount}`);
    console.log(`   Total Questions: ${strengthCount + weaknessCount}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding assessment questions:", error);
    process.exit(1);
  }
};

seedAssessmentQuestions();