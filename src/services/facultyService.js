import Faculty from "../models/Faculty.js";
import Program from "../models/Program.js";
import Enrollment from "../models/Enrollment.js";
import CourseMaterial from "../models/CourseMaterial.js";
import CourseModule from "../models/CourseModule.js";
import LiveClassSession from "../models/LiveClassSession.js";
import Assessment from "../models/Assessment.js";
import AssessmentScore from "../models/AssessmentScore.js";
import FacultyRating from "../models/FacultyRating.js";
import LiveProject from "../models/LiveProject.js";

const recalculateProgramType = async (programId) => {
  const program = await Program.findById(programId);
  if (!program || program.type === "assessment") return;
  const hasLiveMaterial = await CourseMaterial.exists({
    program: programId,
    fileType: { $in: ["live_class", "live_course"] }
  });
  program.type = hasLiveMaterial ? "live_course" : "course";
  await program.save();
};

const allowedFacultyFields = ["fullName", "email", "phone", "gender", "professionalProfile", "profile", "coursesOffered", "isApproved", "approvedAt"];

const pick = (source, keys) =>
  keys.reduce((accumulator, key) => {
    if (source[key] !== undefined) {
      accumulator[key] = source[key];
    }
    return accumulator;
  }, {});

const recalculateFacultyRatingSummary = async (facultyId) => {
  const ratings = await FacultyRating.find({ faculty: facultyId });
  const ratingCount = ratings.length;
  const ratingTotal = ratings.reduce((sum, item) => sum + item.rating, 0);
  const average = ratingCount ? Number((ratingTotal / ratingCount).toFixed(2)) : 0;

  await Faculty.findByIdAndUpdate(facultyId, {
    "ratingSummary.average": average,
    "ratingSummary.count": ratingCount,
    "ratingSummary.stars": ratings.map((item) => item.rating)
  });

  return { average, ratingCount };
};

export const getFacultyDashboard = async (facultyId) => {
  const faculty = await Faculty.findById(facultyId);
  const programs = await Program.find({ faculty: facultyId }).select("_id title description type status startDate durationHours");
  const programIds = programs.map((program) => program._id);
  const recentEnrollments = await Enrollment.find({ program: { $in: programIds } })
    .populate("student", "fullName email profile")
    .populate("program", "title type")
    .sort({ createdAt: -1 })
    .limit(10);

  const [materialsCount, modulesCount, liveClassesCount, assessmentsCount, upcomingLiveClasses, ratings, liveProjectsCount] = await Promise.all([
    CourseMaterial.countDocuments({ faculty: facultyId }),
    CourseModule.countDocuments({ faculty: facultyId }),
    LiveClassSession.countDocuments({ faculty: facultyId, status: { $ne: "cancelled" } }),
    Assessment.countDocuments({ faculty: facultyId }),
    LiveClassSession.find({ faculty: facultyId, status: { $in: ["scheduled", "booked"] }, startAt: { $gte: new Date() } })
      .populate("program", "title type")
      .sort({ startAt: 1 })
      .limit(10),
    FacultyRating.find({ faculty: facultyId }).populate("student", "fullName email"),
    LiveProject.countDocuments({ createdBy: facultyId, creatorRole: "faculty" })
  ]);

  const ratingCount = ratings.length;
  const averageRating = ratingCount
    ? Number((ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratingCount).toFixed(2))
    : 0;

  return {
    faculty: faculty
      ? {
          id: faculty._id,
          fullName: faculty.fullName,
          email: faculty.email,
          phone: faculty.phone,
          gender: faculty.gender,
          profile: faculty.profile,
          professionalProfile: faculty.professionalProfile,
          ratingSummary: faculty.ratingSummary
        }
      : null,
    stats: {
      courses: programs.filter((program) => program.type === "course" || program.type === "live_course").length,
      liveProjects: liveProjectsCount,
      materials: materialsCount,
      modules: modulesCount,
      liveClasses: liveClassesCount,
      assessments: assessmentsCount,
      averageRating,
      ratingCount
    },
    programs,
    recentEnrollments,
    upcomingLiveClasses,
    ratings
  };
};

export const updateFacultyProfile = async (facultyId, updates) => {
  const payload = pick(updates, allowedFacultyFields);
  return Faculty.findByIdAndUpdate(facultyId, payload, { new: true, runValidators: true }).select("-password");
};

export const createCourse = async (facultyId, payload) => {
  const program = await Program.create({
    faculty: facultyId,
    type: "course",
    status: payload.status || "published",
    ...pick(payload, [
      "title", "description", "industry", "domain", "competencies", "preferredJobTags", "minYearEligible", 
      "maxYearEligible", "startDate", "endDate", "applicationDeadline", "durationHours", "maxStudents",
      "creditCost", "priceInr", "courseOverview", "courseIntroduction", "courseProgress", "certification",
      "coverImageUrl"
    ])
  });
  await recalculateProgramType(program._id);
  return program;
};

export const updateCourseOverview = async (facultyId, programId, updates) => {
  const payload = pick(updates, [
    "title",
    "description",
    "courseOverview",
    "courseIntroduction",
    "courseProgress",
    "certification",
    "competencies",
    "preferredJobTags",
    "minYearEligible",
    "maxYearEligible",
    "startDate",
    "endDate",
    "applicationDeadline",
    "durationHours",
    "maxStudents",
    "creditCost",
    "priceInr",
    "status",
    "isActive",
    "coverImageUrl"
  ]);

  const course = await Program.findOneAndUpdate({ _id: programId, faculty: facultyId }, payload, {
    new: true,
    runValidators: true
  }).populate("faculty employer linkedJobs");

  if (course) {
    await recalculateProgramType(course._id);
  }
  return course;
};

export const getCourseStructure = async (facultyId, programId) => {
  const course = await Program.findOne({ _id: programId, faculty: facultyId })
    .populate("faculty employer linkedJobs")
    .populate({
      path: "linkedJobs",
      populate: { path: "linkedPrograms preferredCourses" }
    });

  if (!course) {
    return null;
  }

  const modules = await CourseModule.find({ program: programId })
    .populate("program", "title type")
    .sort({ order: 1, createdAt: 1 });
  const materials = await CourseMaterial.find({ program: programId })
    .populate("program", "title type")
    .populate("module", "title")
    .sort({ createdAt: 1 });

  return {
    course,
    overview: course.courseOverview || {},
    introduction: course.courseIntroduction || {},
    progress: course.courseProgress || {},
    certification: course.certification || {},
    modules,
    materials
  };
};

export const createCourseMaterial = async (facultyId, payload) => {
  const material = await CourseMaterial.create({ faculty: facultyId, ...payload });
  if (material.program) {
    await recalculateProgramType(material.program);
  }
  return material;
};

export const getCourseMaterialById = async (facultyId, materialId) =>
  CourseMaterial.findOne({ _id: materialId, faculty: facultyId }).populate("program", "title type");

export const listCourseMaterials = async (facultyId, filters = {}) => {
  const query = { faculty: facultyId };
  if (filters.programId) {
    query.program = filters.programId;
  }

  return CourseMaterial.find(query).populate("program", "title type").sort({ createdAt: -1 });
};

export const updateCourseMaterial = async (facultyId, materialId, updates) => {
  const material = await CourseMaterial.findOneAndUpdate({ _id: materialId, faculty: facultyId }, updates, { new: true, runValidators: true }).populate(
    "program",
    "title type"
  );
  if (material && material.program) {
    await recalculateProgramType(material.program._id || material.program);
  }
  return material;
};

export const deleteCourseMaterial = async (facultyId, materialId) => {
  const material = await CourseMaterial.findOneAndDelete({ _id: materialId, faculty: facultyId });
  if (material && material.program) {
    await recalculateProgramType(material.program);
  }
  return material;
};

export const createCourseModule = async (facultyId, payload) =>
  CourseModule.create({ faculty: facultyId, ...payload });

export const listCourseModules = async (facultyId, filters = {}) => {
  const query = { faculty: facultyId };
  if (filters.programId) {
    query.program = filters.programId;
  }

  return CourseModule.find(query).populate("program", "title type").sort({ order: 1, createdAt: -1 });
};

export const updateCourseModule = async (facultyId, moduleId, updates) =>
  CourseModule.findOneAndUpdate({ _id: moduleId, faculty: facultyId }, updates, { new: true, runValidators: true }).populate(
    "program",
    "title type"
  );

export const deleteCourseModule = async (facultyId, moduleId) =>
  CourseModule.findOneAndDelete({ _id: moduleId, faculty: facultyId });

export const createLiveClassSession = async (facultyId, payload) =>
  LiveClassSession.create({ faculty: facultyId, ...payload });

export const listLiveClassSessions = async (facultyId, filters = {}) => {
  const query = { faculty: facultyId };
  if (filters.programId) {
    query.program = filters.programId;
  }

  return LiveClassSession.find(query).populate("program", "title type").sort({ startAt: 1 });
};

export const updateLiveClassSession = async (facultyId, sessionId, updates) =>
  LiveClassSession.findOneAndUpdate({ _id: sessionId, faculty: facultyId }, updates, { new: true, runValidators: true }).populate(
    "program",
    "title type"
  );

export const cancelLiveClassSession = async (facultyId, sessionId) =>
  LiveClassSession.findOneAndUpdate(
    { _id: sessionId, faculty: facultyId },
    { status: "cancelled", cancelledAt: new Date() },
    { new: true, runValidators: true }
  ).populate("program", "title type");

export const createAssessment = async (facultyId, payload) =>
  Assessment.create({ faculty: facultyId, ...payload });

export const listAssessments = async (facultyId, filters = {}) => {
  const query = { faculty: facultyId };
  if (filters.programId) {
    query.program = filters.programId;
  }

  return Assessment.find(query).populate("program", "title type").sort({ createdAt: -1 });
};

export const updateAssessment = async (facultyId, assessmentId, updates) =>
  Assessment.findOneAndUpdate({ _id: assessmentId, faculty: facultyId }, updates, { new: true, runValidators: true }).populate(
    "program",
    "title type"
  );

export const upsertAssessmentScore = async (facultyId, assessmentId, payload) => {
  const assessment = await Assessment.findOne({ _id: assessmentId, faculty: facultyId });

  if (!assessment) {
    return null;
  }

  const scoreRecord = await AssessmentScore.findOneAndUpdate(
    { assessment: assessmentId, student: payload.studentId },
    {
      assessment: assessmentId,
      student: payload.studentId,
      faculty: facultyId,
      score: payload.score,
      maxMarks: payload.maxMarks || assessment.maxMarks,
      feedback: payload.feedback,
      gradedAt: new Date()
    },
    { new: true, upsert: true, runValidators: true }
  ).populate("student", "fullName email profile");

  return scoreRecord;
};

export const listFacultyRatings = async (facultyId) =>
  FacultyRating.find({ faculty: facultyId }).populate("student", "fullName email profile").sort({ createdAt: -1 });

export const submitFacultyRating = async (facultyId, payload) => {
  const rating = await FacultyRating.findOneAndUpdate(
    { faculty: facultyId, student: payload.studentId },
    {
      faculty: facultyId,
      student: payload.studentId,
      rating: payload.rating,
      comment: payload.comment
    },
    { new: true, upsert: true, runValidators: true }
  ).populate("student", "fullName email profile");

  await recalculateFacultyRatingSummary(facultyId);

  return rating;
};