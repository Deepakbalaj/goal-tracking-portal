import express from "express";
import { listAuditLogs } from "../controllers/auditController.js";
import { createCycle, listCycles, updateCycle } from "../controllers/cycleController.js";
import { createUser, listUsers, updateUser } from "../controllers/userController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);
router.get("/users", authorize("admin", "manager"), listUsers);
router.post("/users", authorize("admin"), createUser);
router.patch("/users/:id", authorize("admin"), updateUser);
router.get("/cycles", listCycles);
router.post("/cycles", authorize("admin"), createCycle);
router.patch("/cycles/:id", authorize("admin"), updateCycle);
router.get("/audit-logs", authorize("admin"), listAuditLogs);

export default router;
