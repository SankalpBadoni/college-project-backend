import Program from "../models/Program.js";
import Recommendation from "../models/Recommendation.js";
import Student from "../models/Student.js";

export const listMyRecommendations = async (req, res, next) => {
  try {
    const recommendations = await Recommendation.find({ recipientStudent: req.student._id })
      .populate("program")
      .populate("sourceStudent", "fullName")
      .populate("sourceFaculty", "fullName")
      .sort({ createdAt: -1 });

    return res.json(recommendations);
  } catch (error) {
    return next(error);
  }
};

export const generateSystemRecommendations = async (req, res, next) => {
  try {
    const student = await Student.findById(req.student._id).populate("careerTestLatestAttempt");

    if (![3, 4].includes(student.profile.yearOfCourse)) {
      return res.json({
        count: 0,
        programs: [],
        message: "Role-based LP/Job recommendations are available for 3rd or 4th year students"
      });
    }

    const preferredTags = (student.preferredJobs || []).map((j) => `${j.industry}:${j.function}`);

    const rawScores = student.careerTestLatestAttempt?.competencyScores;
    const competencyScores =
      rawScores && typeof rawScores.entries === "function"
        ? Object.fromEntries(rawScores.entries())
        : rawScores || {};
    const weakCompetencies = Object.entries(competencyScores)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3)
      .map(([name]) => name);

    const query = {
      isActive: true,
      status: "published",
      minYearEligible: { $lte: student.profile.yearOfCourse },
      maxYearEligible: { $gte: student.profile.yearOfCourse },
      $or: []
    };

    if (preferredTags.length) {
      query.$or.push({ preferredJobTags: { $in: preferredTags } });
    }

    if (weakCompetencies.length) {
      query.$or.push({ competencies: { $in: weakCompetencies } });
    }

    if (!query.$or.length) {
      delete query.$or;
    }

    const programs = await Program.find(query).limit(10);

    const docs = [];
    for (const program of programs) {
      docs.push({
        recipientStudent: req.student._id,
        program: program._id,
        sourceType: "system",
        message: "Recommended based on your preferences and competency profile"
      });
    }

    if (docs.length) {
      await Recommendation.insertMany(docs, { ordered: false }).catch(() => null);
    }

    return res.json({ count: programs.length, programs });
  } catch (error) {
    return next(error);
  }
};
