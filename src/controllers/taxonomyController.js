import { Industry, Domain, Competency } from "../models/Competency.js";

/**
 * GET /api/taxonomy/industries
 * List all industries
 */
export const listIndustries = async (req, res, next) => {
  try {
    const industries = await Industry.find().sort({ name: 1 });
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
      filter.industry = req.query.industry;
    }
    const domains = await Domain.find(filter).populate("industry", "name").sort({ name: 1 });
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
    if (req.query.domain) {
      filter.domain = req.query.domain;
    }
    if (req.query.type) {
      filter.type = req.query.type;
    }
    const competencies = await Competency.find(filter)
      .populate("domain", "name")
      .populate("industry", "name")
      .sort({ type: 1, name: 1 });
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
      .populate("domain", "name")
      .populate("industry", "name")
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
    const { name, type, domain, industry } = req.body;
    if (!name || !name.trim() || !type || !domain || !industry) {
      return res.status(400).json({ message: "name, type, domain, and industry are required" });
    }

    const existing = await Competency.findOne({ name: name.trim(), domain });
    if (existing) {
      return res.json(existing);
    }

    const competency = await Competency.create({
      name: name.trim(),
      type,
      domain,
      industry
    });
    return res.status(201).json(competency);
  } catch (error) {
    return next(error);
  }
};
