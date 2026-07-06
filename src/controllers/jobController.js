import JobPosting from "../models/JobPosting.js";
import JobApplication from "../models/JobApplication.js";

export const getJobMetadata = async (req, res, next) => {
  return res.json({
    industries: [
      "Information Technology", "Finance", "Healthcare", "Manufacturing", 
      "Retail", "Education", "Consulting", "Design & Arts"
    ],
    departments: [
      "Engineering", "Design", "Product", "Marketing", "Sales", 
      "Human Resources", "Finance", "Operations", "Customer Support"
    ]
  });
};

export const listJobPostings = async (req, res, next) => {
  try {
    const now = new Date();
    const postings = await JobPosting.find({
      isActive: true,
      status: "open",
      $or: [{ deadline: { $exists: false } }, { deadline: null }, { deadline: { $gte: now } }]
    })
      .populate("linkedPrograms preferredCourses requiredCompetencyLinks preferredCompetencyLinks", "title type name")
      .sort({ createdAt: -1 });

    return res.json(postings);
  } catch (error) {
    return next(error);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const job = await JobPosting.findOne({ _id: req.params.id, isActive: true, status: "open" })
      .populate("employer", "companyName profileImage")
      .populate("requiredCompetencyLinks preferredCompetencyLinks linkedPrograms", "title type name");
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    return res.json(job);
  } catch (error) {
    return next(error);
  }
};

export const applyToJob = async (req, res, next) => {
  try {
    const { jobPostingId, coverLetter } = req.body;
    const job = await JobPosting.findById(jobPostingId);

    if (!job || !job.isActive || job.status !== "open") {
      return res.status(404).json({ message: "Job posting not found" });
    }

    if (job.deadline && new Date() > new Date(job.deadline)) {
      return res.status(400).json({ message: "Job application deadline is over" });
    }

    const application = await JobApplication.create({
      student: req.student._id,
      jobPosting: jobPostingId,
      coverLetter
    });

    return res.status(201).json({ message: "Applied to job", application });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already applied for this job" });
    }
    return next(error);
  }
};

export const listMyJobApplications = async (req, res, next) => {
  try {
    const applications = await JobApplication.find({ student: req.student._id })
      .populate("jobPosting", "title companyName postingType employmentType location workMode status isActive deadline applicationDeadline shortlistedStudents")
      .sort({ createdAt: -1 });

    return res.json(applications);
  } catch (error) {
    return next(error);
  }
};
