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

## Data Models Included
- Student
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

## Model Responsibilities (Which model is for what)
- Student: Core student account and profile data, login identity, credits balance, preferred jobs, latest career test attempt reference, and embedded `cartItems` + `favoriteItems`.
- Faculty: Faculty profile shown in program details (name, bio, expertise, experience, completed programs).
- Program: Master catalog entity for all offerings (`course`, `assessment`, `live_project`) including description, eligibility, schedule, prices, credit cost, competencies, and placement stats.
- Enrollment: Student-to-program enrollment record with status lifecycle (`booked`, `ongoing`, `completed`, `cancelled`) and mode (`credits` or `payment`).
- Payment: Payment-link transaction record for paid enrollment flow and confirmation tracking.
- Recommendation: Stores recommendations received by a student from system/faculty/other students.
- Notification: In-app notifications for course start alerts, recommendations, payment updates, and general communication.
- JobPosting: Job opportunities visible to students, with competency requirements, deadline, and optional linked programs.
- JobApplication: Student applications to job postings with application status progression.
- CareerTestTemplate: Configurable MCQ assessment template with competency-weighted options.
- CareerTestAttempt: Student submission data for a career test, computed competency scores, and spider web chart dataset.

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
