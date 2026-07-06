# Backend Job and Notification Implementation

This document describes the backend functions and API endpoints that support job posting lifecycle control, student application status visibility, and shortlist notifications.

## Implemented Behavior

1. Employer job postings now support three actions:
   - Edit: update the posting fields.
   - Close: hide the posting from the student portal while keeping it in the database as a closed posting. But still visible in the frontend for enabling later on.
   - Delete: permanently remove the posting.
2. Students can fetch their applied jobs and see the current application status.
3. Employers can shortlist students and automatically send a shortlist notification.
4. Students can accept or reject a shortlist notification.

## Backend Functions

### Employer job lifecycle

- `createPosting` in `src/controllers/employerController.js`
  - Creates a new job posting.
  - New postings start with `status: "open"` and `isActive: true`.

- `updatePosting` in `src/controllers/employerController.js`
  - Updates editable posting fields.

- `closePosting` in `src/controllers/employerController.js`
  - Marks the job as closed.
  - Sets `status: "closed"`, `isActive: false`, and `closedAt`.

- `deletePosting` in `src/controllers/employerController.js`
  - Deletes the posting from the database.

### Student job visibility

- `listJobPostings` in `src/controllers/jobController.js`
  - Returns only open, active postings for students.

- `getJobById` in `src/controllers/jobController.js`
  - Returns only open, active postings.

- `applyToJob` in `src/controllers/jobController.js`
  - Blocks application to closed or inactive postings.

- `listMyJobApplications` in `src/controllers/jobController.js`
  - Returns the student’s applied jobs with the job posting details and application status.

### Shortlist notification flow

- `shortlistCandidates` in `src/controllers/employerController.js`
  - Employer shortlists student candidates for a posting.
  - The service updates the matching `JobApplication` rows to `status: "shortlisted"`.
  - It creates or refreshes a `job_shortlist` notification for each student.

- `respondToNotification` in `src/controllers/notificationController.js`
  - Student accepts or rejects a shortlist notification.
  - The related notification is updated with `response` and `responseAt`.
  - The related job application is updated as follows:
    - accept -> `shortlisted`
    - reject -> `rejected`

## New/Extended API Endpoints

### Employer

- `POST /api/employers/jobs`
  - Create job posting.

- `PATCH /api/employers/jobs/:jobPostingId`
  - Edit job posting.

- `PATCH /api/employers/jobs/:jobPostingId/close`
  - Close a job posting.

- `DELETE /api/employers/jobs/:jobPostingId`
  - Delete a job posting.

- `POST /api/employers/jobs/:jobPostingId/shortlist`
  - Shortlist students and send shortlist notifications.
  - Body:
    - `studentIds`: array of student IDs
    - `note`: optional shortlist note

### Student

- `GET /api/jobs/postings`
  - List open jobs/internships.

- `GET /api/jobs/postings/:id`
  - Get one open job/internship.

- `POST /api/jobs/apply`
  - Apply to a posting.

- `GET /api/jobs/applications/me`
  - List the student’s own applications with statuses.

- `GET /api/notifications/me`
  - List student notifications.

- `PATCH /api/notifications/me/:notificationId/read`
  - Mark notification as read.

- `PATCH /api/notifications/me/:notificationId/respond`
  - Respond to a shortlist notification.
  - Body:
    - `response`: `accepted` or `rejected`

## Important Data Fields

### JobPosting

- `status`: `open` or `closed`
- `isActive`: boolean used for portal visibility
- `closedAt`: timestamp for close action

### JobApplication

- `status`: `applied`, `shortlisted`, `rejected`, or `placed`

### Notification

- `type`: includes `job_shortlist`
- `jobPosting`: linked posting
- `jobApplication`: linked application
- `senderEmployer`: employer who triggered the notification
- `response`: `accepted` or `rejected`
- `responseAt`: timestamp when the student responded

## Frontend Integration Notes

- Hide the job close action behind the employer dashboard action set.
- Use the application list endpoint for student “Applied Jobs” pages.
- Use the notifications endpoint for shortlist acceptance/rejection actions.
- After accept/reject, refresh both the notifications list and the applied-jobs list.