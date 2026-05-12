import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import catalogRoutes from "./routes/catalogRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import careerTestRoutes from "./routes/careerTestRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import employerRoutes from "./routes/employerRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import liveProjectRoutes from "./routes/liveProjectRoutes.js";
import liveCourseRoutes from "./routes/liveCourseRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/career-tests", careerTestRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/employers", employerRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/live-projects", liveProjectRoutes);
app.use("/api/live-courses", liveCourseRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
