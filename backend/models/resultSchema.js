import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const resultSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  result: {
    type: String,
  },
});

const Result = mongoose.model("Result", resultSchema);

export default Result;
