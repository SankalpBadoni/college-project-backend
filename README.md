# College Project Backend (Student Module)

Node.js + Express + MongoDB backend for student-focused features: registration, course/live-project/assessment discovery, cart/favorites, enrollment by credits or payment link, recommendations, career inclination test, notifications, and job applications.

## Tech
- Node.js (ES Modules)
- Express
- MongoDB + Mongoose
- JWT auth for student routes

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   copy .env.example .env
   ```
3. Update `.env` values (especially `MONGO_URI` and `JWT_SECRET`).
4. Run server:
   ```bash
   npm run dev
   ```

## Base URL
- `http://localhost:5000`

## Important Notes
- Student module only is implemented in this phase.
- `studentId` and `collegeId` are mandatory for enrollment.
- Credits enrollment is allowed till exact program start time.
- Payment flow is mocked with generated payment links; integrate your payment gateway later.

## API Documentation
- Detailed API docs: `docs/API.md`
- Postman collection: `postman/student-module.postman_collection.json`

## Implemented Student Features
- Register/login with profile (college, course, IDs, year)
- Preferred jobs (industry + function), editable anytime
- Embedded student cart and favorites in Student model (no separate collections)
- Browse programs (course/assessment/live project)
- Program details with faculty profile, enrolled count, placement stats field
- Add/remove cart items
- Add/remove favorites
- Purchase via payment link and confirm payment
- Enroll via credits
- My account enrollments grouped by booked/ongoing/completed/cancelled
- Cancel bookings (credit refund for credit-based enrollment)
- Recommendations from faculty/student/system model supported
- Generate recommendations based on preferred jobs + competency gaps
- Start notifications generation endpoint
- Career inclination test submission and spider-web competency data
- Job posting list and application endpoints
- Upcoming programs (month/week/fortnight) with eligibility and preferred-job filtering

## Suggested Next Step
In the next prompt, we can add:
- Employer, Faculty, University Admin auth + permissions
- Admin CRUD for programs/jobs/faculty
- Real payment provider integration (Razorpay/Stripe)
- Scheduler for auto notifications and status transitions
