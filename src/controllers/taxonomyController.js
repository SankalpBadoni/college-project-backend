import { Industry, Domain, Competency, SubCompetency } from "../models/Competency.js";
import mongoose from "mongoose";

/**
 * GET /api/taxonomy/industries
 * List all industries
 */
export const listIndustries = async (req, res, next) => {
  try {
    let industries = await Industry.find().sort({ name: 1 });
    // Always find and prepend the "All/Any" Industry if it exists
    const allAnyIndustry = await Industry.findOne({ name: "All/Any" });
    if (allAnyIndustry) {
      industries = [allAnyIndustry, ...industries.filter(i => i._id.toString() !== allAnyIndustry._id.toString())];
    }
    return res.json(industries);
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /api/taxonomy/industries
 * Create a new industry (faculty/employer only — "Other" flow)
 */
export const createIndustry = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Industry name is required" });
    }

    const existing = await Industry.findOne({ name: name.trim() });
    if (existing) {
      return res.json(existing); // Return existing instead of error, for idempotency
    }

    const industry = await Industry.create({ name: name.trim() });
    return res.status(201).json(industry);
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /api/taxonomy/domains?industry=<industryId>
 * List domains, optionally filtered by industry
 */
export const listDomains = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.industry) {
      const allAnyIndustry = await Industry.findOne({ name: "All/Any" });
      if (allAnyIndustry && req.query.industry === allAnyIndustry._id.toString()) {
        // Do not filter by industry to return all domains
      } else {
        filter.industry = req.query.industry;
      }
    }
    let domains = await Domain.find(filter).populate("industry", "name").sort({ name: 1 });
    // Always find and prepend the "All/Any" Domain if it exists
    const allAnyDomain = await Domain.findOne({ name: "All/Any" }).populate("industry", "name");
    if (allAnyDomain && !domains.some(d => d._id.toString() === allAnyDomain._id.toString())) {
      domains = [allAnyDomain, ...domains];
    }
    return res.json(domains);
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /api/taxonomy/domains
 * Create a new domain under an industry (faculty/employer only — "Other" flow)
 */
export const createDomain = async (req, res, next) => {
  try {
    const { name, industry } = req.body;
    if (!name || !name.trim() || !industry) {
      return res.status(400).json({ message: "Domain name and industry ID are required" });
    }

    const existing = await Domain.findOne({ name: name.trim(), industry });
    if (existing) {
      return res.json(existing);
    }

    const domain = await Domain.create({ name: name.trim(), industry });
    return res.status(201).json(domain);
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /api/taxonomy/competencies?domain=<domainId>&type=technical|behavioral
 * List competencies filtered by domain and/or type
 */
export const listCompetencies = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.industry) {
      const allAnyIndustry = await Industry.findOne({ name: "All/Any" });
      if (allAnyIndustry && req.query.industry === allAnyIndustry._id.toString()) {
        // Do not filter by industry to return all competencies
      } else {
        filter.industries = req.query.industry;
      }
    }
    if (req.query.domain) {
      const allAnyDomain = await Domain.findOne({ name: "All/Any" });
      if (allAnyDomain && req.query.domain === allAnyDomain._id.toString()) {
        // Do not filter by domain to return all competencies
      } else {
        filter.domains = req.query.domain;
      }
    }
    if (req.query.type) {
      filter.type = req.query.type;
    }
    let competencies = await Competency.find(filter)
      .populate("domains", "name")
      .populate("industries", "name")
      .populate("subCompetencies")
      .sort({ type: 1, name: 1 });

    // Always find and prepend the appropriate "All/Any" competency matching the requested type
    const allAnyQuery = { name: { $in: ["All/Any", "All/Any (Behavioral)"] } };
    if (req.query.type) {
      allAnyQuery.type = req.query.type;
    }
    const allAnyCompetencies = await Competency.find(allAnyQuery)
      .populate("domains", "name")
      .populate("industries", "name")
      .populate("subCompetencies");

    for (const allAnyComp of allAnyCompetencies) {
      if (!competencies.some(c => c._id.toString() === allAnyComp._id.toString())) {
        competencies = [allAnyComp, ...competencies];
      }
    }

    return res.json(competencies);
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /api/taxonomy/competencies/all
 * List all competencies (for student registration strength/weakness selection)
 */
export const listAllCompetencies = async (req, res, next) => {
  try {
    const competencies = await Competency.find()
      .populate("domains", "name")
      .populate("industries", "name")
      .populate("subCompetencies")
      .sort({ type: 1, name: 1 });

    // Split by type for convenience
    const technical = competencies.filter(c => c.type === "technical");
    const behavioral = competencies.filter(c => c.type === "behavioral");

    return res.json({ all: competencies, technical, behavioral });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /api/taxonomy/competencies
 * Create a new competency (faculty/employer only — "Other" flow)
 */
export const createCompetency = async (req, res, next) => {
  try {
    const { name, type, domain, domains, industry, industries, subCompetencies } = req.body;
    if (!name || !name.trim() || !type) {
      return res.status(400).json({ message: "name and type are required" });
    }

    // Support both single and array formats
    let finalDomains = [];
    if (domains && Array.isArray(domains)) {
      finalDomains = domains;
    } else if (domain) {
      finalDomains = [domain];
    }

    let finalIndustries = [];
    if (industries && Array.isArray(industries)) {
      finalIndustries = industries;
    } else if (industry) {
      finalIndustries = [industry];
    }

    if (finalDomains.length === 0) {
      return res.status(400).json({ message: "At least one domain is required" });
    }

    // Resolve sub-competencies (create if string names or load if IDs)
    const resolvedSubCompetencyIds = [];
    if (subCompetencies && Array.isArray(subCompetencies)) {
      for (const item of subCompetencies) {
        if (typeof item === "string" && mongoose.Types.ObjectId.isValid(item)) {
          resolvedSubCompetencyIds.push(item);
        } else {
          const nameStr = (typeof item === "string" ? item : item.name || "").trim();
          const descStr = (typeof item === "object" ? item.description || "" : "").trim();
          if (nameStr) {
            let subComp = await SubCompetency.findOne({ name: nameStr });
            if (!subComp) {
              subComp = await SubCompetency.create({ name: nameStr, description: descStr });
            }
            resolvedSubCompetencyIds.push(subComp._id);
          }
        }
      }
    }

    const existing = await Competency.findOne({ name: name.trim() });
    if (existing) {
      let updated = false;
      for (const d of finalDomains) {
        if (!existing.domains.includes(d)) {
          existing.domains.push(d);
          updated = true;
        }
      }
      for (const i of finalIndustries) {
        if (!existing.industries.includes(i)) {
          existing.industries.push(i);
          updated = true;
        }
      }
      for (const scId of resolvedSubCompetencyIds) {
        if (!existing.subCompetencies.includes(scId)) {
          existing.subCompetencies.push(scId);
          updated = true;
        }
      }
      if (updated) {
        await existing.save();
      }
      await existing.populate(["domains", "industries", "subCompetencies"]);
      return res.json(existing);
    }

    const competency = await Competency.create({
      name: name.trim(),
      type,
      domains: finalDomains,
      industries: finalIndustries,
      subCompetencies: resolvedSubCompetencyIds
    });
    
    await competency.populate(["domains", "industries", "subCompetencies"]);
    return res.status(201).json(competency);
  } catch (error) {
    return next(error);
  }
};
