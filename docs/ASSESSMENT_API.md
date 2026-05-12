# Career Profiler Assessment Module - API Documentation

## Overview

The Assessment Module provides a comprehensive personality assessment system based on 4 personality types:
- **Butterfly** 🦋 - Creative Adventurer
- **Dove** 🕊️ - Compassionate Peacemaker
- **Lion** 🦁 - Bold Leader
- **Owl** 🦉 - Thoughtful Analyst

## Features

- ✅ 13 comprehensive assessment questions (8 Strengths + 5 Weaknesses)
- ✅ Personality type identification (Dominant + Secondary)
- ✅ Score calculation with percentages
- ✅ Career recommendations based on personality
- ✅ Detailed personality analysis and profiles
- ✅ User response tracking and history
- ✅ Admin statistics and insights
- ✅ JWT authentication and authorization

## Personality Mapping

| Option | Personality |
|--------|-------------|
| A      | Butterfly   |
| B      | Dove        |
| C      | Lion        |
| D      | Owl         |

## API Endpoints

### 1. Get Assessment Questions

**GET** `/api/assessment/questions`

Fetch all assessment questions grouped by section (strengths and weaknesses).

**Query Parameters:**
- `section` (optional): Filter by section - `strengths` or `weaknesses`

**Response:**
```json
{
  "success": true,
  "message": "Assessment questions retrieved successfully",
  "data": {
    "strengths": [
      {
        "_id": "ObjectId",
        "questionId": 1,
        "section": "strengths",
        "questionText": "Which of the following best describes your professional strength?",
        "options": [
          {
            "code": "A",
            "title": "Risk taker",
            "description": "I readily explore new opportunities and challenges.",
            "personality": "Butterfly"
          },
          {
            "code": "B",
            "title": "Flexible",
            "description": "I adapt quickly if seniors ask me to, but the rules must be given in writing.",
            "personality": "Dove"
          },
          {
            "code": "C",
            "title": "Enthusiastic",
            "description": "I bring energy to new tasks and people.",
            "personality": "Lion"
          },
          {
            "code": "D",
            "title": "Evaluator",
            "description": "I take a lot of time to change and evaluate pros and cons before deciding.",
            "personality": "Owl"
          }
        ]
      }
    ],
    "weaknesses": []
  },
  "totalQuestions": 13
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid section parameter

---

### 2. Submit Assessment

**POST** `/api/assessment/submit`

Submit completed assessment and receive personality analysis results.

**Authentication:** Required (JWT Bearer Token)

**Request Body:**
```json
{
  "userId": "USER_MONGODB_ID",
  "strengthResponses": [
    { "questionId": 1, "selected": "A" },
    { "questionId": 2, "selected": "C" },
    { "questionId": 3, "selected": "B" },
    { "questionId": 4, "selected": "D" },
    { "questionId": 5, "selected": "A" },
    { "questionId": 6, "selected": "B" },
    { "questionId": 7, "selected": "C" },
    { "questionId": 8, "selected": "D" }
  ],
  "weaknessResponses": [
    { "questionId": 1, "selected": "A" },
    { "questionId": 2, "selected": "B" },
    { "questionId": 3, "selected": "C" },
    { "questionId": 4, "selected": "D" },
    { "questionId": 5, "selected": "A" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Assessment submitted successfully",
  "data": {
    "assessmentId": "ObjectId",
    "scores": {
      "butterfly": 5,
      "dove": 4,
      "lion": 2,
      "owl": 2
    },
    "percentages": {
      "butterfly": 38.46,
      "dove": 30.77,
      "lion": 15.38,
      "owl": 15.38
    },
    "dominantType": "Butterfly",
    "secondaryType": "Dove",
    "isMixed": false,
    "personalityAnalysis": {
      "dominant": {
        "type": "Butterfly",
        "summary": "The Creative Adventurer - Spontaneous, flexible, and always seeking new opportunities with enthusiasm and adaptability.",
        "strengths": [
          "Creative and innovative thinking",
          "Adaptable to change",
          "Enthusiastic about new ideas",
          "..."
        ],
        "weaknesses": []
      },
      "secondary": {
        "type": "Dove",
        "summary": "The Compassionate Peacemaker - Empathetic, supportive, and focused on maintaining harmony and helping others succeed."
      },
      "blend": {
        "dominantType": "Butterfly",
        "secondaryType": "Dove",
        "description": "Creative Compassionate - You balance creativity with empathy. You inspire others through innovation while maintaining genuine care for their well-being."
      }
    },
    "careerSuggestions": {
      "recommended": [
        "UX/UI Designer",
        "Creative Director",
        "Marketing Manager",
        "..."
      ]
    },
    "executiveSummary": {
      "headline": "You are a Butterfly (38.46%)",
      "summary": "The Creative Adventurer - Spontaneous, flexible, and always seeking new opportunities with enthusiasm and adaptability.",
      "coreStrengths": [],
      "primaryChallenges": [],
      "idealRoles": []
    },
    "submittedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Status Codes:**
- `200 OK` - Assessment processed successfully
- `400 Bad Request` - Invalid request data or incomplete responses
- `401 Unauthorized` - Missing or invalid authentication token

**Validation Rules:**
- All 8 strength questions must be answered
- All 5 weakness questions must be answered
- Each response must have a valid option (A, B, C, D)
- No duplicate responses for the same question

---

### 3. Get Latest Assessment Results

**GET** `/api/assessment/results/:userId`

Get user's latest assessment results.

**Authentication:** Required (JWT Bearer Token)

**Parameters:**
- `userId` (path): User's MongoDB ObjectId

**Response:**
```json
{
  "success": true,
  "message": "Assessment results retrieved successfully",
  "data": {
    "_id": "ObjectId",
    "userId": "ObjectId",
    "scores": {
      "butterfly": 5,
      "dove": 4,
      "lion": 2,
      "owl": 2
    },
    "percentages": {
      "butterfly": 38.46,
      "dove": 30.77,
      "lion": 15.38,
      "owl": 15.38
    },
    "dominantType": "Butterfly",
    "secondaryType": "Dove",
    "careerSuggestions": [],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Status Codes:**
- `200 OK` - Success
- `403 Forbidden` - User can only access their own results
- `404 Not Found` - No assessment found for user
- `401 Unauthorized` - Missing authentication

---

### 4. Get Assessment History

**GET** `/api/assessment/history/:userId`

Get user's previous assessment results (paginated).

**Authentication:** Required (JWT Bearer Token)

**Parameters:**
- `userId` (path): User's MongoDB ObjectId

**Query Parameters:**
- `limit` (optional, default: 10): Number of results to return

**Response:**
```json
{
  "success": true,
  "message": "Assessment history retrieved successfully",
  "data": [
    {
      "_id": "ObjectId",
      "dominantType": "Butterfly",
      "secondaryType": "Dove",
      "scores": {
        "butterfly": 5,
        "dove": 4,
        "lion": 2,
        "owl": 2
      },
      "percentages": {
        "butterfly": 38.46,
        "dove": 30.77,
        "lion": 15.38,
        "owl": 15.38
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

---

### 5. Check Assessment Completion

**GET** `/api/assessment/check-completion/:userId`

Check if user has completed the assessment.

**Authentication:** Required (JWT Bearer Token)

**Parameters:**
- `userId` (path): User's MongoDB ObjectId

**Response:**
```json
{
  "success": true,
  "data": {
    "completed": true
  }
}
```

---

### 6. Delete Assessment Result

**DELETE** `/api/assessment/results/:responseId`

Delete an assessment result (owner or admin only).

**Authentication:** Required (JWT Bearer Token)

**Parameters:**
- `responseId` (path): Assessment response MongoDB ObjectId

**Response:**
```json
{
  "success": true,
  "message": "Assessment result deleted successfully"
}
```

**Status Codes:**
- `200 OK` - Successfully deleted
- `403 Forbidden` - User can only delete their own assessments
- `404 Not Found` - Assessment not found
- `401 Unauthorized` - Missing authentication

---

### 7. Get Assessment Statistics (Admin Only)

**GET** `/api/assessment/statistics`

Get overall assessment statistics across all users.

**Authentication:** Required (JWT Bearer Token with admin role)

**Response:**
```json
{
  "success": true,
  "message": "Assessment statistics retrieved successfully",
  "data": {
    "totalResponses": 100,
    "totalUniqueUsers": 85,
    "personalityDistribution": [
      {
        "personality": "Butterfly",
        "count": 35,
        "percentage": 35.0
      },
      {
        "personality": "Lion",
        "count": 28,
        "percentage": 28.0
      },
      {
        "personality": "Owl",
        "count": 22,
        "percentage": 22.0
      },
      {
        "personality": "Dove",
        "count": 15,
        "percentage": 15.0
      }
    ],
    "averageScores": {
      "butterfly": 3.2,
      "dove": 2.5,
      "lion": 2.1,
      "owl": 1.8
    }
  }
}
```

**Status Codes:**
- `200 OK` - Success
- `403 Forbidden` - Admin access required
- `401 Unauthorized` - Missing authentication

---

### 8. Get Users by Personality Type (Admin Only)

**GET** `/api/assessment/personality/:personality`

Get all users with a specific dominant personality type.

**Authentication:** Required (JWT Bearer Token with admin role)

**Parameters:**
- `personality` (path): Personality type - `Butterfly`, `Dove`, `Lion`, or `Owl`

**Response:**
```json
{
  "success": true,
  "message": "Users with Lion personality type retrieved successfully",
  "data": [
    {
      "_id": "ObjectId",
      "userId": {
        "_id": "ObjectId",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "dominantType": "Lion",
      "secondaryType": "Butterfly",
      "scores": {
        "butterfly": 2,
        "dove": 1,
        "lion": 6,
        "owl": 1
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

---

## Personality Types Overview

### Butterfly 🦋
**The Creative Adventurer**
- **Strengths:** Creative, adaptive, enthusiastic, spontaneous
- **Weaknesses:** Indecisive, scattered, avoids conflict
- **Ideal Careers:** Designer, Product Manager, Marketing, Entrepreneur
- **Work Style:** Collaborative, flexible, idea-oriented

### Dove 🕊️
**The Compassionate Peacemaker**
- **Strengths:** Empathetic, supportive, listener, loyal
- **Weaknesses:** Too sensitive, people-pleaser, passive
- **Ideal Careers:** HR, Teaching, Psychology, Healthcare
- **Work Style:** Supportive, harmony-focused, team-oriented

### Lion 🦁
**The Bold Leader**
- **Strengths:** Confident, decisive, ambitious, energetic
- **Weaknesses:** Dominating, impatient, stubborn
- **Ideal Careers:** CEO, Sales, Entrepreneur, Manager
- **Work Style:** Competitive, goal-focused, results-driven

### Owl 🦉
**The Thoughtful Analyst**
- **Strengths:** Analytical, detail-oriented, systematic, logical
- **Weaknesses:** Perfectionist, overthinking, rigid
- **Ideal Careers:** Engineer, Data Scientist, Architect, Analyst
- **Work Style:** Methodical, data-driven, quality-focused

---

## Authentication

All protected endpoints require a JWT Bearer token in the Authorization header:

```
Authorization: Bearer <TOKEN>
```

**Example:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:5000/api/assessment/results/USER_ID
```

---

## Error Handling

**Common Error Responses:**

### 400 Bad Request
```json
{
  "success": false,
  "message": "All 8 strength questions must be answered",
  "answered": 6,
  "required": 8
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Missing or invalid authentication token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Unauthorized to access this assessment"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "No assessment found for this user"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Setup and Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Assessment Questions
```bash
node seed-assessment.js
```

### 3. Environment Variables
Ensure your `.env` file contains:
```
MONGODB_URI=mongodb://...
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### 4. Start Server
```bash
npm start
```

---

## Testing with Postman

1. Import `assessment-module.postman_collection.json` into Postman
2. Set environment variables:
   - `BASE_URL`: http://localhost:5000
   - `TOKEN`: Your JWT token
   - `USER_ID`: User's MongoDB ObjectId
3. Test endpoints in the collection

---

## Code Structure

```
src/
├── controllers/
│   └── assessmentController.js      # Request handlers
├── models/
│   ├── AssessmentQuestion.js        # Question schema
│   └── AssessmentResponse.js        # Response schema
├── routes/
│   └── assessmentRoutes.js          # API route definitions
├── services/
│   └── assessmentService.js         # Database operations
├── middleware/
│   └── assessmentValidator.js       # Input validation
├── utils/
│   ├── assessmentConstants.js       # Constants
│   ├── personalityConstants.js      # Personality data
│   ├── scoringUtil.js               # Score calculation
│   └── personalityAnalysis.js       # Analysis generation
└── data/
    └── assessmentQuestionsData.js   # Question seed data
```

---

## Production Considerations

- ✅ JWT authentication for all protected routes
- ✅ Input validation on all endpoints
- ✅ Mongoose schema validation
- ✅ Error handling middleware
- ✅ Database indexing for performance
- ✅ Lean queries for efficiency
- ✅ Proper HTTP status codes
- ✅ Consistent response format
- ✅ Rate limiting (recommended to add)
- ✅ CORS configuration
- ✅ Logging and monitoring (recommended)

---

## Future Enhancements

- [ ] Export results as PDF
- [ ] Email assessment results
- [ ] Comparison with team results
- [ ] Personality matching for hiring
- [ ] Longitudinal tracking over time
- [ ] Mobile app integration
- [ ] Real-time analytics dashboard
- [ ] Multi-language support

---

## Support

For issues or questions, contact the development team or create an issue in the repository.
