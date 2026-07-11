import { Router } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import {
  registerAdmin,
  loginAdmin,
  getDashboardStats,
  getAnalyticsCharts,
  getCourses,
  getEnrollments,
  getPendingFaculty,
  approveFaculty,
  getPendingEmployers,
  approveEmployer,
  getMisReports,
  sendMailCampaign,
  getMailCampaignHistory,
  getPlatformSettings,
  updatePlatformSettings,
  getTrackersData
} from "../controllers/adminController.js";

const router = Router();

// Middleware to protect admin routes
export const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(401).json({ message: "Not authorized. Admin user not found." });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is invalid or expired." });
  }
};

// Middleware to restrict access by role
export const requireAdminRole = (roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: "Not authenticated as admin." });
    }
    
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ 
        message: `Forbidden. This action requires one of these roles: ${roles.join(", ")}` 
      });
    }
    
    next();
  };
};

// Public Authentication
router.post("/auth/register", registerAdmin);
router.post("/auth/login", loginAdmin);

// Protected Admin Routes (Accessible by Dean, University Admin, and EmployU Team)
router.get("/dashboard-stats", protectAdmin, getDashboardStats);
router.get("/analytics/charts", protectAdmin, getAnalyticsCharts);
router.get("/courses", protectAdmin, getCourses);
router.get("/enrollments", protectAdmin, getEnrollments);
router.get("/mis-reports", protectAdmin, getMisReports);
router.get(
  "/trackers", 
  protectAdmin, 
  requireAdminRole(["employu_team"]), 
  getTrackersData
);

// Mailer Module (All Admins can access and send campaigns)
router.post("/mailers/send", protectAdmin, sendMailCampaign);
router.get("/mailers/history", protectAdmin, getMailCampaignHistory);

// Super Admin Only Routes (Accessible ONLY by EmployU Team)
router.get(
  "/faculty/pending", 
  protectAdmin, 
  requireAdminRole(["employu_team"]), 
  getPendingFaculty
);
router.put(
  "/faculty/:id/approve", 
  protectAdmin, 
  requireAdminRole(["employu_team"]), 
  approveFaculty
);

router.get(
  "/employers/pending", 
  protectAdmin, 
  requireAdminRole(["employu_team"]), 
  getPendingEmployers
);
router.put(
  "/employers/:id/approve", 
  protectAdmin, 
  requireAdminRole(["employu_team"]), 
  approveEmployer
);

router.get(
  "/platform/settings", 
  protectAdmin, 
  requireAdminRole(["employu_team"]), 
  getPlatformSettings
);
router.put(
  "/platform/settings", 
  protectAdmin, 
  requireAdminRole(["employu_team"]), 
  updatePlatformSettings
);

export default router;
