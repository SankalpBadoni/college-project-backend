import Student from "../models/Student.js";
import Program from "../models/Program.js";

export const getCart = async (req, res, next) => {
  try {
    const student = await Student.findById(req.student._id)
      .select("cartItems")
      .populate("cartItems.program");

    return res.json({
      student: req.student._id,
      items: student?.cartItems || []
    });
  } catch (error) {
    return next(error);
  }
};

export const addToCart = async (req, res, next) => {
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

    if (!student.cartItems.some((item) => String(item.program) === String(programId))) {
      student.cartItems.push({ program: programId });
      await student.save();
    }

    await student.populate("cartItems.program");
    return res.json({
      message: "Program added to cart",
      cart: { student: student._id, items: student.cartItems }
    });
  } catch (error) {
    return next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { programId } = req.params;
    const student = await Student.findById(req.student._id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.cartItems = student.cartItems.filter((item) => String(item.program) !== String(programId));
    await student.save();
    await student.populate("cartItems.program");

    return res.json({
      message: "Program removed from cart",
      cart: { student: student._id, items: student.cartItems }
    });
  } catch (error) {
    return next(error);
  }
};
