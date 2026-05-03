import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { Industry, Domain, Competency } from "./models/Competency.js";

dotenv.config();

const seedData = [
  {
    industry: "IT & Technology",
    domains: [
      {
        name: "Software Engineering",
        competencies: [
          { name: "Full-Stack Development", type: "technical", subCompetencies: [{ name: "React" }, { name: "Node.js" }] },
          { name: "System Architecture", type: "technical", subCompetencies: [{ name: "Microservices" }] },
          { name: "Problem Solving", type: "behavioral", subCompetencies: [] },
          { name: "Agile Methodology", type: "behavioral", subCompetencies: [] }
        ]
      },
      {
        name: "Data Science",
        competencies: [
          { name: "Machine Learning", type: "technical", subCompetencies: [{ name: "Python" }, { name: "TensorFlow" }] },
          { name: "Data Visualization", type: "technical", subCompetencies: [{ name: "Tableau" }, { name: "PowerBI" }] },
          { name: "Critical Thinking", type: "behavioral", subCompetencies: [] }
        ]
      }
    ]
  },
  {
    industry: "Finance",
    domains: [
      {
        name: "Investment Banking",
        competencies: [
          { name: "Financial Modeling", type: "technical", subCompetencies: [] },
          { name: "Valuation", type: "technical", subCompetencies: [] },
          { name: "Analytical Thinking", type: "behavioral", subCompetencies: [] },
          { name: "High-Pressure Decision Making", type: "behavioral", subCompetencies: [] }
        ]
      },
      {
        name: "Accounting",
        competencies: [
          { name: "Bookkeeping", type: "technical", subCompetencies: [] },
          { name: "Taxation Laws", type: "technical", subCompetencies: [] },
          { name: "Attention to Detail", type: "behavioral", subCompetencies: [] }
        ]
      }
    ]
  },
  {
    industry: "Design & Creative",
    domains: [
      {
        name: "UI/UX Design",
        competencies: [
          { name: "Wireframing & Prototyping", type: "technical", subCompetencies: [{ name: "Figma" }] },
          { name: "User Research", type: "technical", subCompetencies: [] },
          { name: "Empathy", type: "behavioral", subCompetencies: [] },
          { name: "User-Centric Thinking", type: "behavioral", subCompetencies: [] }
        ]
      },
      {
        name: "Graphic Design",
        competencies: [
          { name: "Typography", type: "technical", subCompetencies: [] },
          { name: "Visual Branding", type: "technical", subCompetencies: [{ name: "Adobe Illustrator" }] },
          { name: "Creativity", type: "behavioral", subCompetencies: [] },
          { name: "Attention to Detail", type: "behavioral", subCompetencies: [] }
        ]
      }
    ]
  },
  {
    industry: "Marketing",
    domains: [
      {
        name: "Digital Marketing",
        competencies: [
          { name: "SEO/SEM", type: "technical", subCompetencies: [] },
          { name: "Analytics", type: "technical", subCompetencies: [{ name: "Google Analytics" }] },
          { name: "Data-Driven Decision Making", type: "behavioral", subCompetencies: [] }
        ]
      },
      {
        name: "Content Creation",
        competencies: [
          { name: "Copywriting", type: "technical", subCompetencies: [] },
          { name: "Video Editing", type: "technical", subCompetencies: [] },
          { name: "Creativity", type: "behavioral", subCompetencies: [] }
        ]
      }
    ]
  },
  {
    industry: "Human Resources",
    domains: [
      {
        name: "Talent Acquisition",
        competencies: [
          { name: "Candidate Sourcing", type: "technical", subCompetencies: [] },
          { name: "Interviewing Techniques", type: "technical", subCompetencies: [] },
          { name: "Negotiation", type: "behavioral", subCompetencies: [] }
        ]
      },
      {
        name: "Employee Relations",
        competencies: [
          { name: "Labor Laws", type: "technical", subCompetencies: [] },
          { name: "Conflict Resolution", type: "behavioral", subCompetencies: [] },
          { name: "Emotional Intelligence", type: "behavioral", subCompetencies: [] }
        ]
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("Connected to DB, starting seed...");

    // Clear existing data to prevent duplicates if ran multiple times
    await Industry.deleteMany({});
    await Domain.deleteMany({});
    await Competency.deleteMany({});
    console.log("Cleared existing competency data.");

    for (const indData of seedData) {
      // 1. Create Industry
      const newIndustry = await Industry.create({ name: indData.industry });
      
      for (const domData of indData.domains) {
        // 2. Create Domain
        const newDomain = await Domain.create({
          name: domData.name,
          industry: newIndustry._id
        });

        // 3. Create Competencies
        for (const compData of domData.competencies) {
          await Competency.create({
            name: compData.name,
            type: compData.type,
            domain: newDomain._id,
            industry: newIndustry._id,
            subCompetencies: compData.subCompetencies
          });
        }
      }
    }

    console.log("Seeding completed successfully! 🚀");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
