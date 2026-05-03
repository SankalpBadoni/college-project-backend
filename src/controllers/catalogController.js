import Program from "../models/Program.js";
import Enrollment from "../models/Enrollment.js";
import CourseModule from "../models/CourseModule.js";
import CourseMaterial from "../models/CourseMaterial.js";

const createWindowDate = (windowType) => {
  const now = new Date();
  const end = new Date(now);

  if (windowType === "week") {
    end.setDate(end.getDate() + 7);
  } else if (windowType === "fortnight") {
    end.setDate(end.getDate() + 14);
  } else {
    end.setMonth(end.getMonth() + 1);
  }

  return { now, end };
};

export const listPrograms = async (req, res, next) => {
  try {
    const { type, search } = req.query;
    const filter = { isActive: true, status: "published" };

    if (type) {
      filter.type = type;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const programs = await Program.find(filter)
      .populate("faculty", "fullName bio expertise experienceYears completedPrograms")
      .sort({ createdAt: -1 });

    return res.json(programs);
  } catch (error) {
    return next(error);
  }
};

export const getProgramDetails = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.programId).populate(
      "faculty",
      "fullName bio expertise experienceYears completedPrograms"
    );

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    const enrolledCount = await Enrollment.countDocuments({
      program: program._id,
      status: { $in: ["booked", "ongoing", "completed"] }
    });

    let courseStructure = null;
    if (program.type === "course") {
      const [modules, materials] = await Promise.all([
        CourseModule.find({ program: program._id }).sort({ order: 1, createdAt: 1 }),
        CourseMaterial.find({ program: program._id }).sort({ createdAt: 1 })
      ]);

      courseStructure = {
        overview: program.courseOverview || {},
        introduction: program.courseIntroduction || {},
        progress: program.courseProgress || {},
        certification: program.certification || {},
        modules,
        materials
      };
    }

    return res.json({
      ...program.toObject(),
      enrolledCount,
      expectedStartDate: program.startDate,
      deadlineForApplication: program.applicationDeadline,
      courseStructure
    });
  } catch (error) {
    return next(error);
  }
};

export const listUpcomingPrograms = async (req, res, next) => {
  try {
    const { window = "month", preferredOnly = "true" } = req.query;
    const { now, end } = createWindowDate(window);

    const student = req.student;
    const preferredTags = (student.preferredJobs || []).map((j) => `${j.industry}:${j.function}`);

    const filter = {
      status: "published",
      isActive: true,
      startDate: { $gte: now, $lte: end },
      minYearEligible: { $lte: student.profile.yearOfCourse },
      maxYearEligible: { $gte: student.profile.yearOfCourse }
    };

    if (preferredOnly === "true" && preferredTags.length) {
      filter.preferredJobTags = { $in: preferredTags };
    }

    const programs = await Program.find(filter)
      .populate("faculty", "fullName")
      .sort({ startDate: 1 });

    return res.json({ count: programs.length, window, programs });
  } catch (error) {
    return next(error);
  }
};
