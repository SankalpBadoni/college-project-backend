import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import Faculty from "../models/Faculty.js";
import Employer from "../models/Employer.js";

const getAuthenticatedAccount = async (accountId) => {
  const student = await Student.findById(accountId).select("-password");
  if (student) {
    return { role: "student", account: student };
  }

  const faculty = await Faculty.findById(accountId).select("-password");
  if (faculty) {
    return { role: "faculty", account: faculty };
  }

  const employer = await Employer.findById(accountId).select("-password");
  if (employer) {
    return { role: "employer", account: employer };
  }

  return null;
};

export const protectAccount = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const authenticated = await getAuthenticatedAccount(decoded.id);

    if (!authenticated) {
      return res.status(401).json({ message: "Invalid token user" });
    }

    req.user = authenticated.account;
    req.userRole = authenticated.role;

    if (authenticated.role === "student") {
      req.student = authenticated.account;
    }

    if (authenticated.role === "faculty") {
      req.faculty = authenticated.account;
    }

    if (authenticated.role === "employer") {
      req.employer = authenticated.account;
    }

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

const requireRole = (role) => async (req, res, next) => {
  await protectAccount(req, res, () => {});
  if (res.headersSent) {
    return undefined;
  }

  if (req.userRole !== role) {
    return res.status(403).json({ message: `Access restricted to ${role} accounts` });
  }

  return next();
};

export const protectStudent = requireRole("student");
export const protectFaculty = requireRole("faculty");
export const protectEmployer = requireRole("employer");
