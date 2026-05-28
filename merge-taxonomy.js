import fs from "fs";

const main = () => {
  const dbPath = "./professional_taxonomy_database.json";
  const newPath = "./new_competencies.json";

  if (!fs.existsSync(newPath)) {
    console.error(`Error: File ${newPath} not found! Please save the LLM output to this file.`);
    process.exit(1);
  }

  try {
    const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    const incoming = JSON.parse(fs.readFileSync(newPath, "utf8"));

    const existingSubComps = new Map(db.subCompetencies.map(s => [s.name.toLowerCase().trim(), s]));
    const existingComps = new Map(db.competencies.map(c => [c.name.toLowerCase().trim(), c]));

    // Merge SubCompetencies
    let newSubCount = 0;
    if (incoming.newSubCompetencies && Array.isArray(incoming.newSubCompetencies)) {
      for (const sub of incoming.newSubCompetencies) {
        const key = sub.name.toLowerCase().trim();
        if (!existingSubComps.has(key)) {
          const cleanedSub = { name: sub.name.trim(), description: sub.description?.trim() || "" };
          db.subCompetencies.push(cleanedSub);
          existingSubComps.set(key, cleanedSub);
          newSubCount++;
        }
      }
    }

    // Merge Competencies
    let newCompCount = 0;
    if (incoming.newCompetencies && Array.isArray(incoming.newCompetencies)) {
      for (const comp of incoming.newCompetencies) {
        const key = comp.name.toLowerCase().trim();
        if (existingComps.has(key)) {
          // Merge domains, industries, subCompetencies for existing competency
          const existing = existingComps.get(key);
          
          comp.domainNames?.forEach(d => {
            if (!existing.domainNames.includes(d)) existing.domainNames.push(d);
          });
          comp.industryNames?.forEach(i => {
            if (!existing.industryNames.includes(i)) existing.industryNames.push(i);
          });
          comp.subCompetencies?.forEach(s => {
            if (!existing.subCompetencies.includes(s)) existing.subCompetencies.push(s);
          });
        } else {
          const cleanedComp = {
            name: comp.name.trim(),
            type: comp.type.trim(),
            domainNames: comp.domainNames || [],
            industryNames: comp.industryNames || [],
            subCompetencies: comp.subCompetencies || []
          };
          db.competencies.push(cleanedComp);
          existingComps.set(key, cleanedComp);
          newCompCount++;
        }
      }
    }

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
    console.log(`Successfully merged!`);
    console.log(`- Added ${newSubCount} new sub-competencies.`);
    console.log(`- Added ${newCompCount} new competencies.`);
  } catch (error) {
    console.error("Merge error:", error);
  }
};

main();
