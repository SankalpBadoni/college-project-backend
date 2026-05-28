import mongoose from "mongoose";
import dotenv from "dotenv";
import { Industry, Domain, Competency, SubCompetency } from "./src/models/Competency.js";
import fs from "fs";
const taxonomyData = JSON.parse(fs.readFileSync("./professional_taxonomy_database.json", "utf-8"));

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log("=================================");
    console.log("STARTING MANY-TO-MANY SEEDING");
    console.log("=================================");

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // -----------------------------------------
    // CLEAR EXISTING COLLECTIONS
    // -----------------------------------------
    console.log("\nClearing existing collections...");
    await Competency.deleteMany({});
    await Domain.deleteMany({});
    await Industry.deleteMany({});
    await SubCompetency.deleteMany({});
    console.log("Existing collections cleared");

    // -----------------------------------------
    // SEED INDUSTRIES
    // -----------------------------------------
    console.log("\nSeeding industries...");
    const industryMap = {};
    for (const industry of taxonomyData.industries) {
      const createdIndustry = await Industry.create({
        name: industry.name
      });
      industryMap[industry.name] = createdIndustry;
      console.log(`✓ Industry created: ${industry.name}`);
    }

    // -----------------------------------------
    // SEED DOMAINS
    // -----------------------------------------
    console.log("\nSeeding domains...");
    const domainMap = {};
    for (const domain of taxonomyData.domains) {
      const industry = industryMap[domain.industryName];
      if (!industry) {
        throw new Error(`Industry not found for domain: ${domain.name}`);
      }
      const createdDomain = await Domain.create({
        name: domain.name,
        industry: industry._id
      });
      domainMap[domain.name] = createdDomain;
      console.log(`✓ Domain created: ${domain.name} -> ${domain.industryName}`);
    }

    // -----------------------------------------
    // SEED SUB-COMPETENCIES
    // -----------------------------------------
    console.log("\nSeeding sub-competencies...");
    const subCompetencyMap = {};
    for (const sub of taxonomyData.subCompetencies) {
      const createdSubCompetency = await SubCompetency.create({
        name: sub.name,
        description: sub.description
      });
      subCompetencyMap[sub.name] = createdSubCompetency;
      console.log(`✓ Sub-Competency created: ${sub.name}`);
    }

    // -----------------------------------------
    // SEED COMPETENCIES
    // -----------------------------------------
    console.log("\nSeeding competencies...");
    for (const competency of taxonomyData.competencies) {
      // Resolve Domains
      const domainIds = competency.domainNames.map((domainName) => {
        const domain = domainMap[domainName];
        if (!domain) {
          throw new Error(`Domain not found: ${domainName}`);
        }
        return domain._id;
      });

      // Resolve Industries
      const industryIds = competency.industryNames.map((industryName) => {
        const industry = industryMap[industryName];
        if (!industry) {
          throw new Error(`Industry not found: ${industryName}`);
        }
        return industry._id;
      });

      // Resolve Sub-Competencies
      const subCompetencyIds = [];
      for (const subName of competency.subCompetencies) {
        let subCompetency = subCompetencyMap[subName];
        if (!subCompetency) {
          subCompetency = await SubCompetency.findOne({ name: subName });
          if (!subCompetency) {
            subCompetency = await SubCompetency.create({
              name: subName,
              description: `${subName} sub-competency`
            });
            console.log(`✓ Missing Sub-Competency auto-created: ${subName}`);
          }
          subCompetencyMap[subName] = subCompetency;
        }
        subCompetencyIds.push(subCompetency._id);
      }

      // Create Competency
      const createdCompetency = await Competency.create({
        name: competency.name,
        type: competency.type,
        domains: domainIds,
        industries: industryIds,
        subCompetencies: subCompetencyIds
      });

      console.log(`✓ Competency created: ${createdCompetency.name}`);
    }

    // -----------------------------------------
    // SEED SPECIAL "ALL/ANY" TAXONOMY
    // -----------------------------------------
    console.log("\nSeeding special All/Any taxonomy...");
    const allAnyIndustry = await Industry.create({ name: "All/Any" });
    const allAnyDomain = await Domain.create({
      name: "All/Any",
      industry: allAnyIndustry._id
    });
    
    // Create All/Any Competency for Technical
    const allAnyTechComp = await Competency.create({
      name: "All/Any",
      type: "technical",
      domains: [allAnyDomain._id],
      industries: [allAnyIndustry._id],
      subCompetencies: []
    });
    
    // Create All/Any Competency for Behavioral
    const allAnyBehComp = await Competency.create({
      name: "All/Any (Behavioral)",
      type: "behavioral",
      domains: [allAnyDomain._id],
      industries: [allAnyIndustry._id],
      subCompetencies: []
    });
    
    console.log("✓ Special All/Any Industry created");
    console.log("✓ Special All/Any Domain created");
    console.log("✓ Special All/Any Technical Competency created");
    console.log("✓ Special All/Any Behavioral Competency created");

    // -----------------------------------------
    // COMPLETE
    // -----------------------------------------
    console.log("\n=================================");
    console.log("DATABASE SEEDED SUCCESSFULLY");
    console.log("=================================\n");
    process.exit(0);
  } catch (error) {
    console.error("\nSEEDING ERROR");
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();
