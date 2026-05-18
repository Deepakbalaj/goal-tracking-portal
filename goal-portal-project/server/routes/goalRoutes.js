import express from "express";
import {
  assignSharedGoal,
  createGoal,
  listGoals,
  myGoalSheet,
  submitGoalSheet,
  unlockGoalSheet,
  updateGoal,
} from "../controllers/goalController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);
router.get("/", listGoals);
router.post("/", createGoal);
router.get("/sheet/me", authorize("employee"), myGoalSheet);
router.patch("/:id", updateGoal);
router.post("/sheet/:sheetId/submit", submitGoalSheet);
router.post("/sheet/:sheetId/unlock", authorize("admin"), unlockGoalSheet);
router.post("/shared", authorize("manager", "admin"), assignSharedGoal);

export default router;
