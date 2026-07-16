import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import AssessmentQuestion from "./src/models/AssessmentQuestion.js";
import { Industry, Domain, Competency } from "./src/models/Competency.js";
import { technicalAssessmentQuestions } from "./src/data/technicalQuestionsData.js";

dotenv.config();

const seedTechnicalAssessment = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // 1. Ensure Competencies exist in DB so students can be scored on them
    console.log("📁 Verifying database competencies...");
    let industry = await Industry.findOne({ name: "IT & Technology" });
    if (!industry) {
      industry = await Industry.findOne({ name: "Information Technology" });
    }
    if (!industry) {
      industry = await Industry.create({ name: "IT & Technology" });
      console.log("🏭 Created Industry: IT & Technology");
    }

    let domain = await Domain.findOne({ name: "Software Engineering", industry: industry._id });
    if (!domain) {
      domain = await Domain.findOne({ name: "Software Development", industry: industry._id });
    }
    if (!domain) {
      domain = await Domain.create({ name: "Software Engineering", industry: industry._id });
      console.log("   📁 Created Domain: Software Engineering");
    }

    const requiredCompetencies = [
      "API Development",
      "Database Management Systems",
      "Data Science & Analytics",
      "Frontend Web Development",
      "Cloud Computing & DevOps",
      "Data Structures & Algorithms"
    ];

    const competencyMap = {};
    for (const compName of requiredCompetencies) {
      let comp = await Competency.findOne({ name: compName });
      if (!comp) {
        comp = await Competency.create({
          name: compName,
          type: "technical",
          domain: domain._id,
          industry: industry._id
        });
        console.log(`      ✓ Created Competency: ${compName}`);
      } else {
        console.log(`      ✓ Found Competency: ${compName}`);
      }
      competencyMap[compName] = comp._id;
    }

    // 2. Clear existing technical questions
    console.log("🧹 Clearing existing technical questions...");
    await AssessmentQuestion.deleteMany({ section: "technical" });
    console.log("✅ Cleared existing technical questions");

    // 3. Prepare and insert questions
    console.log("📝 Preparing questions...");
    const preparedQuestions = technicalAssessmentQuestions.map(q => {
      // Map personality to a dummy value or omit if schema is modified.
      // To bypass current strict Mongoose schema validation *before* code change is applied,
      // we can set dummy values for personality on options, but once the schema is relaxed,
      // it won't be necessary. For safety during seeding, we structure it matching the Mongoose schema.
      return {
        questionId: q.questionId,
        section: q.section,
        questionText: q.questionText,
        correctAnswer: q.correctAnswer,
        competencyTag: q.competencyTag,
        options: q.options.map(opt => ({
          code: opt.code,
          title: opt.title,
          description: opt.description,
          personality: "Owl" // Dummy personality to satisfy strict mongoose enum validator if not relaxed
        }))
      };
    });

    console.log(`📝 Inserting ${preparedQuestions.length} technical questions...`);
    const insertedQuestions = await AssessmentQuestion.insertMany(preparedQuestions);
    console.log(`✅ Successfully inserted ${insertedQuestions.length} technical questions`);

    console.log("\n📊 Seeding Complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding technical assessment:", error);
    process.exit(1);
  }
};

seedTechnicalAssessment();
