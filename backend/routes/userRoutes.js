import express from "express";
import dotenv from "dotenv";
import multer from "multer";
dotenv.config();

import {
  fileFilter,
  fileUpload,
  getUser,
  login,
  profile,
  register,
} from "../controllers/userControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter, // ensure fileFilter is defined before this line
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Auth & user routes
router.get("/", getUser);
router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, profile);

// Upload route
router.post("/analyze", upload.single("resume"), fileUpload);

export default router;
