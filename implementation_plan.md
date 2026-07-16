# Technical Assessment Implementation Plan

This plan outlines the design and integration of a new **Technical Assessment** within the student portal. Students can answer 30 MCQ questions covering 6 distinct IT industry segments. Their correct answers are calculated as competency percentages, stored in their profile, and rendered dynamically on the dashboard spiderweb chart.

---

## User Review Required

We need to decide on the best strategy for adjusting the DB models:
> [!IMPORTANT]
> **Can we use the exact Mongoose models currently in the codebase?**
> **No**, because the current schemas are strictly locked to behavioral/personality assessment properties:
> - `AssessmentQuestion` strictly enforces `section` enums (`"strengths"`, `"weaknesses"`, `"communication"`) and requires a `personality` enum (`"Butterfly"`, `"Dove"`, `"Lion"`, `"Owl"`) on options.
> - `AssessmentResponse` strictly enforces `assessmentType` enums and scores personality archetypes (butterfly, dove, etc.) rather than technical competencies.
> - `validateAssessmentSubmission` middleware strictly validates question lengths based on behavioral constants.
>
> We propose **extending and generalizing the existing models** (Approach A) because it preserves the existing API endpoints and leverages the current React components seamlessly. We will make `personality` optional, add a `"technical"` section, and support `correctAnswer` and `competencyTag` fields.

---

## Open Questions

> [!WARNING]
> **Competency Overwriting vs. Merging:**
> Currently, saving a student's assessment results overwrites the entire `student.competency` array in the database.
> If a student takes the behavioral assessment first, and then the technical assessment, the behavioral competencies would be deleted (and vice versa).
> **Proposed Fix:** We will modify the database update logic in the controller to *merge* competency scores instead of replacing the entire array.

---

## Proposed Changes

### Database Schemas & Constants

#### [MODIFY] [AssessmentQuestion.js](file:///c:/Users/Ayush/Desktop/Sameer's College project/college-project-backend/src/models/AssessmentQuestion.js)
- Extend `section` enum to include `"technical"`.
- Make `options.personality` optional (remove `required: true`).
- Add `correctAnswer` field (`type: String`, `enum: ["A", "B", "C", "D"]`, optional).
- Add `competencyTag` field (`type: String`, optional) representing the mapped IT segment name.

#### [MODIFY] [AssessmentResponse.js](file:///c:/Users/Ayush/Desktop/Sameer's College project/college-project-backend/src/models/AssessmentResponse.js)
- Extend `assessmentType` enum to include `"technical"`.
- Add `technicalResponses` field to store array of `{ questionId, selected }`.
- Add `technicalScores` map field to store competency scores (e.g. `{ "API Development": 80 }`).

#### [MODIFY] [assessmentConstants.js](file:///c:/Users/Ayush/Desktop/Sameer's College project/college-project-backend/src/utils/assessmentConstants.js)
- Add `"technical"` to `ASSESSMENT_SECTIONS`.

---

### Backend Logic & API

#### [MODIFY] [assessmentValidator.js](file:///c:/Users/Ayush/Desktop/Sameer's College project/college-project-backend/src/middleware/assessmentValidator.js)
- Modify `validateQuestionsQuery` to allow `"technical"` as a valid section query.
- Update `validateAssessmentSubmission` to dynamically check submission lengths and required arrays based on `req.body.assessmentType`. For `"technical"`, validate that it has exactly 30 questions in `technicalResponses` (or `strengthResponses` if reusing the same array payload for simplicity).

#### [MODIFY] [assessmentController.js](file:///c:/Users/Ayush/Desktop/Sameer's College project/college-project-backend/src/controllers/assessmentController.js)
- In `submitAssessment`, handle `assessmentType === "technical"` separately:
  1. Retrieve all active technical questions from the database.
  2. Map submitted answers to correct answers. Group by `competencyTag` (6 segments).
  3. Calculate the percentage of correct answers for each segment (e.g. `correct / 5 * 100`).
  4. Fetch `Competency` DB documents corresponding to the 6 technical competency names.
  5. **Merge** these calculated scores into the student's `competency` array in the database rather than overwriting.
  6. Return a structured response matching the results payload.

---

### Seeding Scripts

#### [NEW] [technicalQuestionsData.js](file:///c:/Users/Ayush/Desktop/Sameer's College project/college-project-backend/src/data/technicalQuestionsData.js)
- Stores 30 high-quality MCQ questions across the 6 IT industry segments (5 questions per segment):
  1. **API Development** (ApiDev)
  2. **Database Management Systems** (DBMS)
  3. **Data Science & Analytics** (DataScience)
  4. **Frontend Web Development** (WebDev)
  5. **Cloud Computing & DevOps** (Cloud)
  6. **Data Structures & Algorithms** (DSA)

#### [NEW] [seed-technical-assessment.js](file:///c:/Users/Ayush/Desktop/Sameer's College project/college-project-backend/seed-technical-assessment.js)
- Connects to MongoDB, seeds the 6 technical competencies if not present, clears old technical questions, and inserts the 30 new technical MCQs.

---

### Frontend (Student Portal)

#### [MODIFY] [studentService.ts](file:///c:/Users/Ayush/Desktop/Sameer's College project/skillSurge-frontend/src/services/studentService.ts)
- Add endpoints if needed (reusing `assessmentService` is preferred if matching structure).

#### [MODIFY] [Assessment.tsx](file:///c:/Users/Ayush/Desktop/Sameer's College project/skillSurge-frontend/src/pages/student/Assessment.tsx)
- Unlock the "Technical Assessments" list. Instead of displaying "Locked", map a unified card "Technical Diagnostic Assessment" to open the quiz view.
- Handle state and render views for the 30 technical questions.
- Display a dedicated Results view for the technical quiz showing the technical competency spiderweb and percentages for each segment.

#### [MODIFY] [Dashboard.tsx](file:///c:/Users/Ayush/Desktop/Sameer's College project/skillSurge-frontend/src/pages/student/Dashboard.tsx)
- Update the technical spiderweb display. Ensure it populates its subjects dynamically from the student's database `competency` entries if they are present, matching: `'API Development'`, `'Database Management Systems'`, `'Data Science & Analytics'`, `'Frontend Web Development'`, `'Cloud Computing & DevOps'`, and `'Data Structures & Algorithms'`.

---

## Verification Plan

### Automated / Database Verification
1. Run the seed script:
   ```bash
   node seed-technical-assessment.js
   ```
2. Query the MongoDB database using a test script to ensure:
   - 30 questions exist under section `"technical"`.
   - The 6 required competencies exist in the competencies collection.

### Manual Verification
1. Log in as a student in the frontend.
2. Go to the Assessments page and click on the unlocked **Technical Diagnostic Assessment**.
3. Complete the 30-question assessment and submit.
4. Verify that:
   - The backend correctly grades the submission.
   - The results screen shows the correct percentages for each of the 6 competencies.
   - The student's competencies are updated and merged in the DB.
5. Navigate to the Student Dashboard and verify that the "Technical Skills" radar chart reflects the updated scores accurately.
