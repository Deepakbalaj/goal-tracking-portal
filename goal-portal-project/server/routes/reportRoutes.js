import express from "express";
import { achievementReport, dashboardAnalytics } from "../controllers/reportController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);
router.get("/dashboard", dashboardAnalytics);
router.get("/achievements", authorize("manager", "admin"), achievementReport);

export default router;
