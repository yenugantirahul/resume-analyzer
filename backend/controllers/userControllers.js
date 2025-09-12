import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";

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
