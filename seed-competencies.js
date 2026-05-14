/**
 * Seed Competency Data (Industry → Domain → Competency)
 * Run: node seed-competencies.js
 *
 * Seeds Industries, Domains and Competencies used for personality-based
 * spider-web analysis. Each personality type maps to 6 competencies.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import {
  Industry,
  Domain,
  Competency,
} from "./src/models/Competency.js";

dotenv.config();

const seedData = {
  industries: [
    {
      name: "IT & Technology",
      domains: [
        {
          name: "Software Development",
          competencies: [
            { name: "Problem Solving", type: "technical" },
            { name: "Systematic Planning", type: "technical" },
            { name: "Analytical Thinking", type: "technical" },
            { name: "Data Literacy", type: "technical" },
          ],
        },
        {
          name: "Product & Design",
          competencies: [
            { name: "Creativity", type: "technical" },
            { name: "Ideation", type: "behavioral" },
            { name: "Attention to Detail", type: "technical" },
            { name: "Research", type: "technical" },
          ],
        },
      ],
    },
    {
      name: "Business & Management",
      domains: [
        {
          name: "Strategy & Operations",
          competencies: [
            { name: "Leadership", type: "behavioral" },
            { name: "Strategic Thinking", type: "behavioral" },
            { name: "Decision Making", type: "behavioral" },
            { name: "Initiative", type: "behavioral" },
            { name: "Competitiveness", type: "behavioral" },
            { name: "Persuasion", type: "behavioral" },
          ],
        },
        {
          name: "Marketing & Communications",
          competencies: [
            { name: "Communication", type: "behavioral" },
            { name: "Networking", type: "behavioral" },
            { name: "Multitasking", type: "behavioral" },
            { name: "Adaptability", type: "behavioral" },
          ],
        },
      ],
    },
    {
      name: "Healthcare & Social Services",
      domains: [
        {
          name: "People & Wellbeing",
          competencies: [
            { name: "Empathy", type: "behavioral" },
            { name: "Teamwork", type: "behavioral" },
            { name: "Active Listening", type: "behavioral" },
            { name: "Patience", type: "behavioral" },
            { name: "Supportiveness", type: "behavioral" },
            { name: "Conflict Resolution", type: "behavioral" },
          ],
        },
      ],
    },
  ],
};

const seedCompetencies = async () => {
  try {
    await connectDB();

    console.log("🗑️  Clearing existing competency data...");
    await Competency.deleteMany({});
    await Domain.deleteMany({});
    await Industry.deleteMany({});
    console.log("✅ Cleared existing data");

    let totalIndustries = 0;
    let totalDomains = 0;
    let totalCompetencies = 0;

    for (const industryData of seedData.industries) {
      const industry = await Industry.create({ name: industryData.name });
      totalIndustries++;
      console.log(`🏭 Created Industry: ${industryData.name}`);

      for (const domainData of industryData.domains) {
        const domain = await Domain.create({
          name: domainData.name,
          industry: industry._id,
        });
        totalDomains++;
        console.log(`   📁 Created Domain: ${domainData.name}`);

        for (const comp of domainData.competencies) {
          await Competency.create({
            name: comp.name,
            type: comp.type,
            domain: domain._id,
            industry: industry._id,
          });
          totalCompetencies++;
          console.log(`      ✓ Competency: ${comp.name} (${comp.type})`);
        }
      }
    }

    console.log("\n📊 Seed Summary:");
    console.log(`   Industries:    ${totalIndustries}`);
    console.log(`   Domains:       ${totalDomains}`);
    console.log(`   Competencies:  ${totalCompetencies}`);
    console.log("\n✨ Competency data seeded successfully!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding competency data:", error);
    process.exit(1);
  }
};

seedCompetencies();
