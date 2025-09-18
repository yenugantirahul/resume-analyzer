import express from "express";
import dotenv from "dotenv";
import userRouters from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: "https://resume-analyzer-project.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT || 5001;
connectDB();
app.use("/api/users", userRouters);
app.listen(PORT, () => {
  console.log("Server listening on port 5001");
});
