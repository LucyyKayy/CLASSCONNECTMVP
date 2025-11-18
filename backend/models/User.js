// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ["student","parent","teacher"], required: true },
  name: { type: String, required: true },
  email: { type: String, lowercase:true, index:true },
  passwordHash: { type: String },
  classCode: { type: String }, // students store join code
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
