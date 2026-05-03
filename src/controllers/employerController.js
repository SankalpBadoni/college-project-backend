import Employer from "../models/Employer.js";
import JobPosting from "../models/JobPosting.js";
import JobApplication from "../models/JobApplication.js";

export const getEmployerDashboardData = async (req, res, next) => {
  try {
    const employerId = req.user._id;

    // Mock/aggregated structure for the frontend
    
    const stats = {
      activeJobs: 12,        // e.g. await JobPosting.countDocuments({ employer: employerId, type: "Job", status: "Active" })
      activeInternships: 4,  // e.g. await JobPosting.countDocuments({ employer: employerId, type: "Internship", status: "Active" })
      totalApplicants: 342,  // e.g. await JobApplication.countDocuments({ "job.employer": employerId })
      interviewsScheduled: 8
    };

    const recentApplicants = [
      { id: 1, candidateName: "Candidate Name A", matchScore: 95, jobTitle: "Senior Frontend Engineer", appliedAt: "2 hours ago" },
      { id: 2, candidateName: "Candidate Name B", matchScore: 95, jobTitle: "Senior Frontend Engineer", appliedAt: "2 hours ago" },
      { id: 3, candidateName: "Candidate Name C", matchScore: 95, jobTitle: "Senior Frontend Engineer", appliedAt: "2 hours ago" },
      { id: 4, candidateName: "Candidate Name D", matchScore: 95, jobTitle: "Senior Frontend Engineer", appliedAt: "2 hours ago" }
    ];

    return res.json({
      stats,
      recentApplicants
    });
  } catch (error) {
    return next(error);
  }
};
