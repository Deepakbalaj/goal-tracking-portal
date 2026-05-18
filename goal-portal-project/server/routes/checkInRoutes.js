import express from "express";
import { addManagerComment, listCheckIns, upsertCheckIn } from "../controllers/checkInController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);
router.get("/", listCheckIns);
router.put("/:goalId/:quarter", upsertCheckIn);
router.post("/:id/comments", authorize("manager", "admin"), addManagerComment);

export default router;
