import express from "express";
import { decideGoalSheet, listPendingApprovals } from "../controllers/approvalController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect, authorize("manager", "admin"));
router.get("/pending", listPendingApprovals);
router.post("/:sheetId/decision", decideGoalSheet);

export default router;
