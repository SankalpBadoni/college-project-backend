# Student Module API Documentation

## Auth
### 1. Register Student
- `POST /api/auth/students/register`
- Body:
```json
{
  "fullName": "Aarav Mehta",
  "email": "aarav@example.com",
  "password": "secret123",
  "phone": "9999999999",
  "profile": {
    "collegeName": "ABC University",
    "collegeId": "COL-1001",
    "studentId": "STU-2001",
    "courseName": "B.Tech CSE",
    "yearOfCourse": 3
  },
  "preferredJobs": [
    { "industry": "IT", "function": "Backend Developer" },
    { "industry": "Fintech", "function": "Data Analyst" }
  ]
}
```

### 2. Login Student
- `POST /api/auth/students/login`
- Body:
```json
{
  "email": "aarav@example.com",
  "password": "secret123"
}
```

## Student Profile
### 3. Get My Profile
- `GET /api/students/me`
- Auth: Bearer token

### 4. Update My Profile
- `PATCH /api/students/me`
- Auth: Bearer token

### 5. Update Preferred Jobs
- `PATCH /api/students/me/preferred-jobs`
- Auth: Bearer token
- Body:
```json
{
  "preferredJobs": [
    { "industry": "IT", "function": "Full Stack Developer" }
  ]
}
```

## Catalog
### 6. List Programs
- `GET /api/catalog/programs?type=course&search=python`
- `type`: `course | assessment | live_project`

### 7. Get Program Details
- `GET /api/catalog/programs/:programId`
- Includes: faculty profile, enrolled count, expected start date, application deadline

### 8. List Upcoming Programs for Student
- `GET /api/catalog/programs/upcoming/me?window=week&preferredOnly=true`
- Auth: Bearer token
- `window`: `week | fortnight | month`

## Cart
### 9. Get Cart
- `GET /api/cart`
- Auth: Bearer token

### 10. Add to Cart
- `POST /api/cart`
- Auth: Bearer token
- Body:
```json
{ "programId": "PROGRAM_OBJECT_ID" }
```

### 11. Remove from Cart
- `DELETE /api/cart/:programId`
- Auth: Bearer token

## Favorites
### 12. Get Favorites
- `GET /api/favorites`
- Auth: Bearer token

### 13. Add to Favorites
- `POST /api/favorites`
- Auth: Bearer token
- Body:
```json
{ "programId": "PROGRAM_OBJECT_ID" }
```

### 14. Remove from Favorites
- `DELETE /api/favorites/:programId`
- Auth: Bearer token

## Enrollment
### 15. Enroll using Credits
- `POST /api/enrollments`
- Auth: Bearer token
- Body:
```json
{
  "programId": "PROGRAM_OBJECT_ID",
  "mode": "credits"
}
```

### 16. My Account Enrollments
- `GET /api/enrollments/me`
- Auth: Bearer token
- Returns grouped `booked`, `ongoing`, `completed`, `cancelled`

### 17. Cancel Booking
- `PATCH /api/enrollments/:enrollmentId/cancel`
- Auth: Bearer token

## Payments
### 18. Create Payment Link
- `POST /api/payments/links`
- Auth: Bearer token
- Body:
```json
{ "programId": "PROGRAM_OBJECT_ID" }
```

### 19. Confirm Payment
- `PATCH /api/payments/:paymentId/confirm`
- Auth: Bearer token

## Recommendations
### 20. List My Recommendations
- `GET /api/recommendations/me`
- Auth: Bearer token

### 21. Generate System Recommendations
- `POST /api/recommendations/me/generate`
- Auth: Bearer token

## Notifications
### 22. List Notifications
- `GET /api/notifications/me`
- Auth: Bearer token

### 23. Mark Notification as Read
- `PATCH /api/notifications/me/:notificationId/read`
- Auth: Bearer token

### 24. Generate Course Start Notifications
- `POST /api/notifications/me/generate-course-start`
- Auth: Bearer token

## Career Inclination Test
### 25. Get Active Test
- `GET /api/career-tests/active`
- Auth: Bearer token

### 26. Submit Test
- `POST /api/career-tests/submit`
- Auth: Bearer token
- Body:
```json
{
  "templateId": "CAREER_TEST_TEMPLATE_ID",
  "answers": [
    { "questionIndex": 0, "selectedOptionIndex": 1 },
    { "questionIndex": 1, "selectedOptionIndex": 2 }
  ]
}
```

### 27. Get Career Analysis (Strength/Weakness + Spider Data)
- `GET /api/career-tests/analysis/me`
- Auth: Bearer token

## Jobs
### 28. List Job Postings
- `GET /api/jobs/postings`
- Auth: Bearer token

### 29. Apply to Job Posting
- `POST /api/jobs/apply`
- Auth: Bearer token
- Body:
```json
{
  "jobPostingId": "JOB_OBJECT_ID",
  "coverLetter": "I am interested in this role"
}
```

### 30. List My Job Applications
- `GET /api/jobs/applications/me`
- Auth: Bearer token

## Health
### 31. API Health
- `GET /api/health`

## Employer Dashboard
### 32. Register Employer
- `POST /api/auth/employers/register`
- Body:
```json
{
  "companyName": "Acme Tech",
  "divisionDept": "Talent Acquisition",
  "approvingAuthority": { "name": "Rita Shah", "dept": "HR" },
  "contactPerson": {
    "name": "Arjun Mehta",
    "dept": "Recruitment",
    "email": "arjun@acme.com",
    "phone": "9999991111"
  },
  "password": "secret123"
}
```

### 33. Login Employer
- `POST /api/auth/employers/login`
- Body:
```json
{ "email": "arjun@acme.com", "password": "secret123" }
```

### 34. Get Employer Dashboard
- `GET /api/employers/dashboard`
- Auth: Bearer token

### 35. Get My Employer Profile
- `GET /api/employers/me`
- Auth: Bearer token

### 36. Update My Employer Profile
- `PATCH /api/employers/me`
- Auth: Bearer token

### 37. Create Job / Internship / Requirement
- `POST /api/employers/jobs`
- Auth: Bearer token
- Body:
```json
{
  "title": "Backend Engineer",
  "companyName": "Acme Tech",
  "location": "Bengaluru",
  "workMode": "hybrid",
  "employmentType": "full-time",
  "salaryRange": { "min": 700000, "max": 1200000, "currency": "INR", "text": "7-12 LPA" },
  "postedAt": "2026-05-03T00:00:00.000Z",
  "deadline": "2026-06-30T00:00:00.000Z",
  "aboutCompany": {
    "companyDescription": "Product company focused on B2B workflows",
    "industry": "IT Services",
    "mission": "Build reliable tools for teams",
    "website": "https://acme.example.com"
  },
  "jobDescription": {
    "roleSummary": "Build and maintain backend services",
    "purpose": "Ship scalable APIs",
    "organizationalFit": "Works with product and platform teams"
  },
  "keyResponsibilities": [
    "Develop REST APIs",
    "Work with product and QA"
  ],
  "requiredQualifications": {
    "education": ["B.Tech / BE"],
    "technicalSkills": ["Node.js", "MongoDB"],
    "softSkills": ["Communication", "Collaboration"],
    "experienceLevel": "0-2 years"
  },
  "preferredQualifications": {
    "niceToHaveSkills": ["Docker"],
    "certifications": [],
    "bonusExperience": ["Internship in backend development"]
  },
  "compensationBenefits": {
    "salaryDetails": "7-12 LPA",
    "perks": ["Health insurance", "Learning budget"],
    "growthOpportunities": ["Mentorship", "Promotion path"]
  },
  "applicationProcess": {
    "howToApply": "Upload resume and portfolio link",
    "requiredDocuments": ["Resume", "Cover letter"],
    "hiringSteps": ["Test", "Interview", "Final round"]
  },
  "screeningQuestions": [
    { "question": "Describe your experience with Node.js", "isRequired": true },
    { "question": "Are you available to join within 30 days?", "isRequired": false }
  ],
  "additionalInformation": {
    "workCulture": "Collaborative and fast-moving",
    "recommendedPrograms": ["PROGRAM_OBJECT_ID"],
    "workingHours": "Flexible",
    "timezone": "IST"
  },
  "restriction": {
    "minYear": 3,
    "maxYear": 4,
    "streams": ["CSE", "IT"],
    "genders": ["Male", "Female", "Other"]
  },
  "requiredCompetencyLinks": ["COMPETENCY_OBJECT_ID"],
  "preferredCompetencyLinks": ["COMPETENCY_OBJECT_ID"],
  "requiredCompetencies": ["Node.js", "MongoDB"],
  "industry": "IT Services",
  "function": "Backend",
  "preferredCourses": ["PROGRAM_OBJECT_ID"],
  "tagType": "hot_job_linked",
  "visualElements": {
    "coverImageUrl": "https://images.example.com/job-cover.png",
    "bannerImageUrl": "https://images.example.com/job-banner.png",
    "accentColor": "#1F6FEB"
  }
}
```

### 38. List My Postings
- `GET /api/employers/jobs`
- Auth: Bearer token

### 39. Get Posting Details
- `GET /api/employers/jobs/:jobPostingId`
- Auth: Bearer token

### 39a. Get Job Structure
- `GET /api/employers/jobs/:jobPostingId/structure`
- Auth: Bearer token

### 40. Update Posting
- `PATCH /api/employers/jobs/:jobPostingId`
- Auth: Bearer token

### 41. Delete Posting
- `DELETE /api/employers/jobs/:jobPostingId`
- Auth: Bearer token

### 42. Find Eligible Students for a Posting
- `POST /api/employers/jobs/:jobPostingId/candidates`
- Auth: Bearer token
- Body example:
```json
{ "completedOnly": true, "streams": ["CSE"], "genders": ["Female"] }
```

### 43. Shortlist Students for a Posting
- `POST /api/employers/jobs/:jobPostingId/shortlist`
- Auth: Bearer token
- Body:
```json
{
  "studentIds": ["STUDENT_OBJECT_ID"],
  "note": "Strong match for urgent role"
}
```

### 44. Create Live Project
- `POST /api/employers/live-projects`
- Auth: Bearer token

### 45. Tag Existing Live Project or Course
- `PATCH /api/employers/live-projects/:programId/tags`
- Auth: Bearer token
- Body:
```json
{
  "employerPreferred": true,
  "hotJobLinked": true,
  "exclusiveJobLinked": false,
  "preferredJobTags": ["IT:Backend Developer"]
}
```

## Faculty Dashboard
### 46. Register Faculty
- `POST /api/auth/faculty/register`
- Body:
```json
{
  "fullName": "Dr. Neha Verma",
  "email": "neha@example.com",
  "password": "secret123",
  "phone": "9999992222",
  "gender": "Female",
  "professionalProfile": {
    "describesBest": "Data Science",
    "otherDescription": "ML and analytics"
  },
  "coursesOffered": []
}
```

### 47. Login Faculty
- `POST /api/auth/faculty/login`
- Body:
```json
{ "email": "neha@example.com", "password": "secret123" }
```

### 48. Get Faculty Dashboard
- `GET /api/faculty/dashboard`
- Auth: Bearer token

### 49. Get My Faculty Profile
- `GET /api/faculty/me`
- Auth: Bearer token

### 50. Update My Faculty Profile
- `PATCH /api/faculty/me`
- Auth: Bearer token

### 51. Upload Course Material
- `POST /api/faculty/me/materials`
- Auth: Bearer token
- Content-Type: `multipart/form-data` (recommended)
- Multipart fields:
  - `file`: PDF/PPT/DOC/video file (optional)
  - `program`: `PROGRAM_OBJECT_ID` (required)
  - `title`: material title (required)
  - `description`, `moduleName`, `fileType` (optional)
- Notes:
  - When `file` is provided, backend uploads to AWS S3 and sets `fileUrl` automatically.
  - If `file` is not provided, you can still send `fileUrl` in JSON body.
- JSON Body example (without file upload):
```json
{
  "program": "PROGRAM_OBJECT_ID",
  "title": "Unit 1 Notes",
  "description": "Intro notes",
  "moduleName": "Basics",
  "fileUrl": "https://files.example.com/unit1.pdf",
  "fileType": "pdf"
}
```

### 52. Add Module or Additional Content
- `POST /api/faculty/me/modules`
- Auth: Bearer token

### 53. Book Live Class Slot
- `POST /api/faculty/me/live-classes`
- Auth: Bearer token

### 54. Cancel or Update Live Class Slot
- `PATCH /api/faculty/me/live-classes/:sessionId`
- `DELETE /api/faculty/me/live-classes/:sessionId`
- Auth: Bearer token

### 55. Upload Assessment
- `POST /api/faculty/me/assessments`
- Auth: Bearer token

### 56. Update Assessment Scores
- `POST /api/faculty/me/assessments/:assessmentId/scores`
- Auth: Bearer token

### 57. View Faculty Ratings
- `GET /api/faculty/me/ratings`
- Auth: Bearer token

### 58. Student Rating for Faculty
- `POST /api/faculty/:facultyId/ratings`
- Auth: Bearer token
- Body:
```json
{ "studentId": "STUDENT_OBJECT_ID", "rating": 5, "comment": "Very clear explanations" }
```

### 59. Update Course Overview / Landing Section
- `PATCH /api/faculty/me/courses/:programId/overview`
- Auth: Bearer token
- Body:
```json
{
  "title": "Complete Web Development",
  "description": "Build modern web apps end to end",
  "courseOverview": {
    "shortDescription": "A flexible full-stack course",
    "targetAudience": ["Beginners", "Career switchers"],
    "learningOutcomes": ["Build REST APIs", "Ship a frontend app"],
    "prerequisites": [],
    "numberOfModules": 8
  },
  "courseIntroduction": {
    "enabled": false,
    "welcomeVideoUrl": "",
    "roadmap": []
  },
  "courseProgress": {
    "enabled": false,
    "milestones": [],
    "badges": []
  },
  "certification": {
    "enabled": false,
    "minimumScore": 80,
    "projectRequired": false,
    "criteria": []
  }
}
```

### 60. Get Course Structure
- `GET /api/faculty/me/courses/:programId/structure`
- Auth: Bearer token

## Course Structure Fields
### Program Course Overview
- `courseOverview.shortDescription`
- `courseOverview.targetAudience`
- `courseOverview.learningOutcomes`
- `courseOverview.prerequisites`
- `courseOverview.numberOfModules`
- `courseOverview.numberOfLessons`

### Program Course Introduction
- `courseIntroduction.enabled`
- `courseIntroduction.welcomeVideoUrl`
- `courseIntroduction.platformGuide`
- `courseIntroduction.roadmap`
- `courseIntroduction.visualElements`

### Course Modules
- `module.title`
- `module.objectives`
- `module.videoLessons`
- `module.readingMaterials`
- `module.examples`
- `module.interactiveElements`
- `module.assessments`
- `module.capstoneProject`
- `module.visualElements`

### Course Materials
- `phase`: `pre | mid | post | ongoing`
- `materialKind`: `ppt | pdf | infographic_static | infographic_animated | video | live_project | assessment | quiz | assignment | notes | other`
- `assetStyle`: `static | animated | interactive | document | video | live`
- `isVisualRelief`: `true | false`
- `visualElements`

## New Models Used
- Employer
- Faculty
- JobPosting
- Program
- CourseMaterial
- CourseModule
- LiveClassSession
- Assessment
- AssessmentScore
- FacultyRating

## Data Models Included
- Student
- Employer
- Faculty
- Program (`course`, `assessment`, `live_project`)
- Enrollment
- Payment
- Recommendation
- Notification
- JobPosting
- JobApplication
- CareerTestTemplate
- CareerTestAttempt
- CourseMaterial
- CourseModule
- LiveClassSession
- Assessment
- AssessmentScore
- FacultyRating

## Model Responsibilities (Which model is for what)
- Student: Core student account and profile data, login identity, credits balance, preferred jobs, latest career test attempt reference, and embedded `cartItems` + `favoriteItems`.
- Employer: Employer account, premium/normal tier, approval status, and contact/company profile data.
- Faculty: Faculty profile shown in program details plus dashboard content, calendar, ratings, and teaching profile fields.
- Program: Master catalog entity for all offerings (`course`, `assessment`, `live_project`) including description, eligibility, employer tags, schedule, prices, credit cost, competencies, and placement stats.
- Enrollment: Student-to-program enrollment record with status lifecycle (`booked`, `ongoing`, `completed`, `cancelled`) and mode (`credits` or `payment`).
- Payment: Payment-link transaction record for paid enrollment flow and confirmation tracking.
- Recommendation: Stores recommendations received by a student from system/faculty/other students.
- Notification: In-app notifications for course start alerts, recommendations, payment updates, and general communication.
- JobPosting: Job opportunities visible to students, with employer ownership, source link, urgency, slot count, candidate restrictions, competency requirements, deadline, tags, and optional linked programs or preferred courses.
- JobApplication: Student applications to job postings with application status progression.
- CareerTestTemplate: Configurable MCQ assessment template with competency-weighted options.
- CareerTestAttempt: Student submission data for a career test, computed competency scores, and spider web chart dataset.
- CourseMaterial: Faculty-uploaded course content.
- CourseModule: Faculty-created module and additional content entries.
- LiveClassSession: Faculty live class calendar slot.
- Assessment: Faculty assessment metadata and questions.
- AssessmentScore: Faculty grading record for a student assessment submission.
- FacultyRating: Student star rating and comment for a faculty profile.

## Model to API Flow Mapping
- Student: `/api/auth/students/*`, `/api/students/*`, `/api/cart*`, `/api/favorites*`, and used indirectly by all protected student APIs.
- Program: `/api/catalog/programs*`, plus referenced by cart/favorites/enrollments/payments/recommendations/jobs.
- Enrollment: `/api/enrollments*`.
- Payment: `/api/payments*`.
- Recommendation: `/api/recommendations*`.
- Notification: `/api/notifications*`.
- JobPosting and JobApplication: `/api/jobs/*`.
- CareerTestTemplate and CareerTestAttempt: `/api/career-tests/*`.

## Limitations in this phase
- No role-based modules yet for Employer/Faculty/Admin
- No scheduler/cron for automatic status transitions and notification dispatch
- No real payment gateway integration (mock link only)
- No seed APIs included by default for faculty/program/job creation
