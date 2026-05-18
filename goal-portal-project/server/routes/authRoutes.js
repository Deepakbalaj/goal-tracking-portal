import express from "express";
import { entraLogin, login, me } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.post("/login", login);
router.post("/entra", entraLogin);
router.get("/me", protect, me);

export default router;
