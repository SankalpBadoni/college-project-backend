# Knowledge Transfer: Implementing Email Notifications (Backend)

This document outlines the key locations in the backend codebase where platform notifications are generated. Use this to integrate email notifications (via NodeMailer, SendGrid, Amazon SES, etc.) alongside the database-persisted notifications.

---

## 1. Notification Model (`Notification.js`)
Refer to the schema file: [Notification.js](file:///c:/Users/Ayush/Desktop/Sameer's%20College%20project/college-project-backend/src/models/Notification.js)
Notifications are stored in the database with fields such as:
- `recipientType`: `'student'` or `'employer'`
- `student`: ObjectId referencing Student (recipient or sender depending on role)
- `senderEmployer`: ObjectId referencing Employer (sender)
- `recipientEmployer`: ObjectId referencing Employer (recipient)
- `type`: `'general' | 'job_shortlist' | 'job_offer' | 'course_start'`
- `title` / `message`: Content text

---

## 2. Notification Triggers (Key Functions)

### Trigger A: Student Shortlisted for Interview / Interview Scheduled
* **Function**: `shortlistEmployerCandidates` and `updateCandidateStatus`
* **File**: [employerService.js](file:///c:/Users/Ayush/Desktop/Sameer's%20College%20project/college-project-backend/src/services/employerService.js)
* **Code Coordinates**: 
  - `shortlistEmployerCandidates` (lines 484-517)
  - `updateCandidateStatus` (lines 600-621)
* **Recipient**: **Student** (`studentId`)
* **Context**: Triggered when an employer shortlists a candidate or updates/schedules their interview details.
* **Database Action**:
  ```javascript
  await Notification.findOneAndUpdate(
    { student: studentId, type: "job_shortlist", jobPosting: posting._id },
    {
      recipientType: "student",
      student: studentId,
      jobPosting: posting._id,
      jobApplication: application?._id,
      senderEmployer: employerId,
      type: "job_shortlist",
      title: `Shortlisted for ${posting.title}`,
      message: `You have been shortlisted for ${posting.title} at ${posting.companyName}.`,
      metadata: { ...interviewDetails }
    },
    { upsert: true, new: true }
  );
  ```
* **Email Recommendation**: Send an email to the student with the interview date, time, type (online vs venue), and meeting link/location.

---

### Trigger B: Hiring Offer Extended to Student
* **Function**: `updateCandidateStatus`
* **File**: [employerService.js](file:///c:/Users/Ayush/Desktop/Sameer's%20College%20project/college-project-backend/src/services/employerService.js)
* **Code Coordinates**: `updateCandidateStatus` (lines 574-598)
* **Recipient**: **Student** (`studentId`)
* **Context**: Triggered when an employer clicks "Yes (Interview Done)" and fills the Hiring Offer details.
* **Database Action**:
  ```javascript
  await Notification.findOneAndUpdate(
    { student: studentId, type: "job_offer", jobPosting: posting._id },
    {
      recipientType: "student",
      student: studentId,
      jobPosting: posting._id,
      jobApplication: application?._id,
      senderEmployer: employerId,
      type: "job_offer",
      title: `Hiring Offer: ${posting.title}`,
      message: `Congratulations! ${posting.companyName} has extended a hiring offer...`,
      metadata: { ...offerDetails }
    },
    { upsert: true, new: true }
  );
  ```
* **Email Recommendation**: Send a congratulations email to the student containing offer details (stipend/salary, expected joining date, welcome note) and a direct link to their applied jobs portal to accept/decline.

---

### Trigger C: Student Application Rejected
* **Function**: `updateCandidateStatus`
* **File**: [employerService.js](file:///c:/Users/Ayush/Desktop/Sameer's%20College%20project/college-project-backend/src/services/employerService.js)
* **Code Coordinates**: `updateCandidateStatus` (lines 562-572)
* **Recipient**: **Student** (`studentId`)
* **Context**: Triggered when an employer rejects a candidate.
* **Database Action**:
  ```javascript
  await Notification.create({
    recipientType: "student",
    student: studentId,
    jobPosting: posting._id,
    jobApplication: application?._id,
    senderEmployer: employerId,
    type: "general",
    title: `Application Update for ${posting.title}`,
    message: `Thank you for your interest... we have decided not to proceed...`
  });
  ```
* **Email Recommendation**: Send a standard, polite application rejection email.

---

### Trigger D: Student Responds to Shortlist / Offer (Accepted or Declined)
* **Function**: `respondToNotification`
* **File**: [notificationController.js](file:///c:/Users/Ayush/Desktop/Sameer's%20College%20project/college-project-backend/src/controllers/notificationController.js)
* **Code Coordinates**: lines 112-128
* **Recipient**: **Employer** (`employerId` / `recipientEmployer`)
* **Context**: Triggered when a student clicks "Accept Interview", "Decline Invite", "Accept Offer", or "Decline Offer".
* **Database Action**:
  ```javascript
  await Notification.create({
    recipientType: "employer",
    recipientEmployer: employerId,
    student: req.student._id,
    jobPosting: jobPosting._id,
    jobApplication: jobApplication?._id,
    type: "general",
    title: isOffer ? `🎉 Offer Accepted: ${jobPosting.title}` : `Candidate Response: ${jobPosting.title}`,
    message: isOffer 
      ? `🎉 ${studentName} accepted your hiring offer...` 
      : `${studentName} has accepted the interview...`
  });
  ```
* **Email Recommendation**: Send an email notification to the employer's HR contact email notifying them of the candidate's action (accepted/declined) with a link to view candidates for the job posting.

---

### Trigger E: Course / Program Starts in 48 Hours
* **Function**: `generateCourseStartNotifications`
* **File**: [notificationController.js](file:///c:/Users/Ayush/Desktop/Sameer's%20College%20project/college-project-backend/src/controllers/notificationController.js)
* **Code Coordinates**: lines 164-167
* **Recipient**: **Student** (`student._id`)
* **Context**: Cron / scheduler triggers generation of notification when a booked course starts within 48 hours.
* **Database Action**:
  ```javascript
  await Notification.insertMany(notifications);
  ```
* **Email Recommendation**: Send a reminder email to the student with the course start date, syllabus link, or virtual room link.

---

## 3. Recommended Email Integration Architecture

Instead of block-blocking main request-response threads, create an email helper/service utility (e.g. `src/services/emailService.js`) and trigger emails asynchronously.

### Draft Implementation of `emailService.js`
```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendNotificationEmail = async ({ toEmail, subject, text, html }) => {
  try {
    await transporter.sendMail({
      from: `"SkillSurge Team" <no-reply@skillsurge.com>`,
      to: toEmail,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error('Email failed to send:', error);
  }
};
```

Whenever a DB `Notification` is created or upserted in the code locations above, call the email service asynchronously:
```javascript
// Example in employerService.js (Hiring Offer):
import { sendNotificationEmail } from './emailService.js';
import Student from '../models/Student.js'; // To fetch recipient email

const studentDoc = await Student.findById(studentId);
if (studentDoc?.email) {
  sendNotificationEmail({
    toEmail: studentDoc.email,
    subject: `🎉 Hiring Offer Received: ${posting.title}`,
    text: `Congratulations! ${posting.companyName} has extended a hiring offer...`,
    html: `<p>Congratulations! <strong>${posting.companyName}</strong> has extended a hiring offer...</p>`
  }).catch(err => console.error("Email trigger failed:", err));
}
```
