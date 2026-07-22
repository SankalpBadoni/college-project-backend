# Ed-Tech Platform — MongoDB Schema Design

---

## Core Philosophy

- **University** and **Course/Department** are independent master-data collections — populated once, reused via references.
- Professors **extend** the base faculty-user with a university affiliation sub-document.
- Lean on **referencing** for entities that are queried/filtered independently; **embed** only small, stable, non-shared data.

---

## Collections

### 1. `universities`

Master list. Students pick from this dropdown; if missing, they create a new document here.

```js
{
  _id: ObjectId,
  name: "Delhi Technological University",   // indexed for dropdown search
  branches: [
    { _id: ObjectId, label: "North Campus" },
    { _id: ObjectId, label: "South Campus" },
    { _id: ObjectId, label: "West Campus" },
    { _id: ObjectId, label: "East Campus" }
  ],
  // branches embedded ✅ — small, stable, always fetched with the university
  createdBy: ObjectId,   // ref → users._id (the student who added it, if user-generated)
  verified: Boolean,     // false if user-submitted, true after admin approval
  createdAt: Date
}
```

> **Relationship:** `universities` ← referenced by → `users` (students & professors)
> Branches are **embedded** as they are tightly coupled to the university and never queried in isolation.

---

### 2. `universityDegree`

University degrees (BTech, MBA, MCA, etc.). Platform-level master list, not per-university.

```js
{
  _id: ObjectId,
  name: "BTech",
  durationYears: 4,
  createdAt: Date
}
```

---

### 3. `departments`

Platform-level master list (CS, Mechanical, Finance, etc.)

```js
{
  _id: ObjectId,
  name: "Computer Science",
  createdAt: Date
}
```

> `universityDegree` and `departments` are **referenced** from users — they are independent axes, queried and filtered separately for analytics.

---

#### Student model modifications:

```js
{
  // ...base fields,
  role: "student",
  university: {
    universityId: ObjectId,   // ref → universities._id
    branchId: ObjectId        // ref → universities.branches._id (embedded sub-doc id)
  },
  // university info embedded as a small snapshot ✅
  // (avoids a join just to display "DTU – North Campus" on the dashboard)
  courseId: ObjectId,          // ref → courses._id
  departmentId: ObjectId,      // ref → departments._id
  enrollmentYear: Number,
  semester: Number
}
```

---

#### Professor model:

```js
{
  // ...base fields,
  role: "professor",

  // --- University affiliation (professor-specific) ---
  university: {
    universityId: ObjectId,   // ref → universities._id
    branchId: ObjectId
  },
  departmentId: ObjectId,     // ref → departments._id
  designation: String,        // "HOD", "Assistant Professor", etc.
  employeeId: String,         // university-issued ID

  // --- Faculty-equivalent fields (inherited features) ---
  // Whatever your faculty role carries, add those fields here too.
  // Since professor IS a faculty but with extras, just extend in the same doc.
  bio: String,
  subjectsTaught: [String],
  availableForMentorship: Boolean
}
```

---

## Relationship Map

```
universities  ←──(ref)──  users.university.universityId
universities.branches  ←──(embedded ref)──  users.university.branchId

courses       ←──(ref)──  users.courseId        (students only)
departments   ←──(ref)──  users.departmentId    (students + professors)

users (role: professor) extends users (role: faculty)
  └── same collection, extra fields scoped to professor role
```

---

## Key Indexes

```js
// Fast dashboard fetch: all students of a university
db.student.createIndex({ "university.universityId":1 })

// Filter by course + department (analytics)
db.student.createIndex({ courseId: 1, departmentId: 1 })

// University dropdown search
db.universities.createIndex({ name: "text" })

// Professors by university + department
db.professor.createIndex(
  { "university.universityId": 1, departmentId: 1 }
)
```

---

## Registration Flow (dropdown logic)

```
User opens registration form
  └─► Frontend fetches GET /universities  →  renders dropdown

  ├── University found?
  │     └─► Student selects university → fetches its branches → selects branch
  │
  └── University NOT found?
        └─► Student fills: university name + branch label
              → POST /universities  { name, branch, createdBy, verified: false }
              → New university doc created
              → Its _id + branchId stored in user doc
```

---

## Summary of Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| All users in one collection | ✅ Yes | Role-based querying is simpler; avoids cross-collection joins |
| University branches | Embedded | Always fetched with university; never queried alone |
| Course / Department | Referenced | Independent master data; filtered separately in analytics |
| Professor vs Faculty | Same collection, extra fields | Professor IS-A faculty; no duplication, clean extension |
| University snapshot in user doc | Small embedded ref | Avoids lookup just to show "DTU – North Campus" on dashboard |
| User-submitted universities | `verified: false` flag | Allows admin moderation without blocking the student |
