import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import pdf from "pdf-parse-debugging-disabled";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getUser(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  res.json({
    name: user.name,
    email: user.email,
  });
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({
      message: "User with email already exists",
    });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be greater than six character" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).send({ message: "Enter a valid email" });
  }
  try {
    const user = new User({ name, email, password });
    const savedUser = await user.save();
    res.status(201).json({
      message: {
        name: savedUser.name,
        email: savedUser.email,
      },
    });
  } catch (error) {
    console.log("Error at register controller", error);
    res.status(401).send({ message: "Something went wrong" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with email does not exist" });
    }

    // 3️⃣ Compare password
    const isMatch = await user.matchPassword(password); // <-- use instance
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 4️⃣ Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 5️⃣ Send response with token
    res.status(200).json({
      message: "Login successful",
      token, // send token to client
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function profile(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile fetched successfully",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export function fileFilter(req, file, cb) {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
}
export async function fileUpload(req, res) {
  try {
    const file = req.file.buffer;
    const data = await pdf(file);

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    You are an expert career coach who helps candidates prepare for top product-based companies 
    like Google, Amazon, Meta, and Microsoft. 

    Read the following resume text and write a detailed paragraph of feedback. 
    Your response should flow naturally like professional career advice, 
    but it must cover these aspects 
    overall impression, key strengths, weaknesses or gaps, ATS readiness, 
    skills missing for FAANG-level roles, and practical improvements the candidate should make. 
    End the paragraph with suggested areas to prepare for interviews. 

    Here is the resume text:
    ${data.text}
    `;

    const geminiRes = await model.generateContent(prompt);

    res.status(200).json({ message: geminiRes.response.text() });
  } catch (error) {
    console.error("Upload error:", error);
    res
      .status(500)
      .json({ message: "Failed to parse PDF", error: error.message });
  }
}
