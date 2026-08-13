import Enrollment from "../models/Enrollment.js";
import Program from "../models/Program.js";
import Student from "../models/Student.js";

const validateEligibility = (student, program) => {
  const year = student.profile.yearOfCourse;
  return year >= program.minYearEligible && year <= program.maxYearEligible;
};

export const enrollProgram = async (req, res, next) => {
  try {
    const { programId, mode } = req.body;
    const student = await Student.findById(req.student._id);
    const program = await Program.findById(programId);

    if (!program || !program.isActive || program.status !== "published") {
      return res.status(404).json({ message: "Program not available" });
    }

    if (!student.profile?.studentId || !student.profile?.collegeId) {
      return res
        .status(400)
        .json({ message: "studentId and collegeId are mandatory for enrollment" });
    }

    if (!validateEligibility(student, program)) {
      return res.status(400).json({ message: "Student is not eligible for this program" });
    }

    // if (program.startDate && new Date() > new Date(program.startDate)) {
    //   return res
    //     .status(400)
    //     .json({ message: "Enrollment by credits is allowed only till program start time" });
    // }

    let enrollment = await Enrollment.findOne({ student: student._id, program: program._id });
    if (enrollment && enrollment.status !== "cancelled") {
      return res.status(400).json({ message: "Already enrolled in this program" });
    }

    if (mode === "credits") {
      if (student.credits < program.creditCost) {
        return res.status(400).json({ message: "Insufficient credits" });
      }

      student.credits -= program.creditCost;
      await student.save();

      if (!enrollment) {
        enrollment = await Enrollment.create({
          student: student._id,
          program: program._id,
          enrollmentMode: "credits",
          creditsUsed: program.creditCost
        });
      } else {
        enrollment.status = "booked";
        enrollment.enrollmentMode = "credits";
        enrollment.creditsUsed = program.creditCost;
        enrollment.cancelledAt = undefined;
        await enrollment.save();
      }

      return res.status(201).json({ message: "Enrolled using credits", enrollment, creditsLeft: student.credits });
    }

    return res.status(400).json({ message: "Use payment link flow for paid enrollment" });
  } catch (error) {
    return next(error);
  }
};

export const getMyEnrollments = async (req, res, next) => {
  try {
    const grouped = {
      booked: [],
      ongoing: [],
      completed: [],
      cancelled: []
    };

    const enrollments = await Enrollment.find({ student: req.student._id })
      .populate({
        path: "program",
        populate: [
          { path: "faculty", select: "fullName bio experienceYears" },
          { path: "competencies", select: "name" }
        ]
      })
      .sort({ createdAt: -1 });

    for (const enrollment of enrollments) {
      grouped[enrollment.status].push(enrollment);
    }

    return res.json(grouped);
  } catch (error) {
    return next(error);
  }
};

export const cancelEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.enrollmentId,
      student: req.student._id
    }).populate("program");

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    if (enrollment.status === "cancelled") {
      return res.status(400).json({ message: "Enrollment already cancelled" });
    }

    enrollment.status = "cancelled";
    enrollment.cancelledAt = new Date();
    await enrollment.save();

    if (enrollment.enrollmentMode === "credits" && enrollment.creditsUsed > 0) {
      const student = await Student.findById(req.student._id);
      student.credits += enrollment.creditsUsed;
      await student.save();
    }

    return res.json({ message: "Booking cancelled successfully", enrollment });
  } catch (error) {
    return next(error);
  }
};
