import express from "express";
import dotenv from "dotenv";
import {
  getUser,
  login,
  profile,
  register,
} from "../controllers/userControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

dotenv.config();
const router = express.Router();

router.get("/", getUser);
router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, profile);

export default router;
