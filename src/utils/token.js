import jwt from "jsonwebtoken";

const generateToken = (studentId) =>
  jwt.sign({ id: studentId, role: "student" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

export default generateToken;
