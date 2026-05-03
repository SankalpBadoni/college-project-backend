import bcrypt from "bcryptjs";
import Student from "../models/Student.js";
import generateToken from "../utils/token.js";
import Faculty from "../models/Faculty.js";
import Employer from "../models/Employer.js";

const sanitizeEmail = (email) => email?.toLowerCase().trim();

const loginWithModel = async (res, model, findQuery, password, responseKey, responseFields) => {
  const account = await model.findOne(findQuery);

  if (!account) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const match = await bcrypt.compare(password, account.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  return res.json({
    message: "Login successful",
    token: generateToken(account._id),
    [responseKey]: responseFields(account)
  });
};

export const registerStudent = async (req, res, next) => {
  try {
    const { fullName, email, password, phone, profile, preferredJobs = [] } = req.body;

    if (!profile?.collegeId || !profile?.studentId) {
      return res.status(400).json({ message: "collegeId and studentId are mandatory" });
    }

    const exists = await Student.findOne({ email: sanitizeEmail(email) });
    if (exists) {
      return res.status(400).json({ message: "Student already registered with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await Student.create({
      fullName,
      email: sanitizeEmail(email),
      password: hashedPassword,
      phone,
      profile,
      preferredJobs
    });

    return res.status(201).json({
      message: "Student registered successfully",
      token: generateToken(student._id),
      student: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
        profile: student.profile,
        preferredJobs: student.preferredJobs,
        credits: student.credits
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const loginStudent = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    return loginWithModel(
      res,
      Student,
      { email: sanitizeEmail(email) },
      password,
      "student",
      (student) => ({
        id: student._id,
        fullName: student.fullName,
        email: student.email,
        profile: student.profile,
        preferredJobs: student.preferredJobs,
        credits: student.credits
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const registerFaculty = async (req, res, next) => {
  try {
    const { fullName, email, password, phone, gender, professionalProfile, coursesOffered } = req.body;

    const exists = await Faculty.findOne({ email: sanitizeEmail(email) });
    if (exists) {
      return res.status(400).json({ message: "Faculty already registered with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const faculty = await Faculty.create({
      fullName,
      email: sanitizeEmail(email),
      password: hashedPassword,
      phone,
      gender,
      professionalProfile,
      coursesOffered,
      isApproved: false
    });

    return res.status(201).json({
      message: "Faculty registered successfully. Pending approval.",
      token: generateToken(faculty._id),
      faculty: {
        id: faculty._id,
        fullName: faculty.fullName,
        email: faculty.email,
        role: faculty.role,
        isApproved: faculty.isApproved
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const registerEmployer = async (req, res, next) => {
  try {
    const { companyName, divisionDept, approvingAuthority, contactPerson, password } = req.body;

    const exists = await Employer.findOne({ "contactPerson.email": sanitizeEmail(contactPerson?.email) });
    if (exists) {
      return res.status(400).json({ message: "Employer already registered with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const employer = await Employer.create({
      companyName,
      divisionDept,
      approvingAuthority,
      contactPerson: {
        ...contactPerson,
        email: sanitizeEmail(contactPerson?.email)
      },
      password: hashedPassword,
      isApproved: false
    });

    return res.status(201).json({
      message: "Employer registered successfully. Pending approval.",
      token: generateToken(employer._id),
      employer: {
        id: employer._id,
        companyName: employer.companyName,
        contactEmail: employer.contactPerson.email,
        role: employer.role,
        isApproved: employer.isApproved
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const loginFaculty = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    return loginWithModel(
      res,
      Faculty,
      { email: sanitizeEmail(email) },
      password,
      "faculty",
      (faculty) => ({
        id: faculty._id,
        fullName: faculty.fullName,
        email: faculty.email,
        role: faculty.role,
        isApproved: faculty.isApproved
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const loginEmployer = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    return loginWithModel(
      res,
      Employer,
      { "contactPerson.email": sanitizeEmail(email) },
      password,
      "employer",
      (employer) => ({
        id: employer._id,
        companyName: employer.companyName,
        contactEmail: employer.contactPerson.email,
        role: employer.role,
        tier: employer.tier,
        isApproved: employer.isApproved
      })
    );
  } catch (error) {
    return next(error);
  }
};
