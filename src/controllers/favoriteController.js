import Student from "../models/Student.js";
import Program from "../models/Program.js";

export const getFavorites = async (req, res, next) => {
  try {
    const student = await Student.findById(req.student._id)
      .select("favoriteItems")
      .populate({
        path: "favoriteItems.program",
        populate: { path: "competencies", select: "name" }
      });

    return res.json({
      student: req.student._id,
      items: student?.favoriteItems || []
    });
  } catch (error) {
    return next(error);
  }
};

export const addToFavorites = async (req, res, next) => {
  try {
    const { programId } = req.body;
    const program = await Program.findById(programId);
    if (!program || !program.isActive) {
      return res.status(404).json({ message: "Program not available" });
    }

    const student = await Student.findById(req.student._id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.favoriteItems.some((item) => String(item.program) === String(programId))) {
      student.favoriteItems.push({ program: programId });
      await student.save();
    }

    await student.populate({
      path: "favoriteItems.program",
      populate: { path: "competencies", select: "name" }
    });
    return res.json({
      message: "Program added to favorites",
      favorite: { student: student._id, items: student.favoriteItems }
    });
  } catch (error) {
    return next(error);
  }
};

export const removeFromFavorites = async (req, res, next) => {
  try {
    const { programId } = req.params;
    const student = await Student.findById(req.student._id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.favoriteItems = student.favoriteItems.filter(
      (item) => String(item.program) !== String(programId)
    );
    await student.save();
    await student.populate({
      path: "favoriteItems.program",
      populate: { path: "competencies", select: "name" }
    });

    return res.json({
      message: "Program removed from favorites",
      favorite: { student: student._id, items: student.favoriteItems }
    });
  } catch (error) {
    return next(error);
  }
};
