import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  teacherId: { type: String, required: true }, // ✅ now accepts any string (e.g., 1234, ABCD)
  className: { type: String },
  language: { type: String }, // host language (e.g., English, German)
  createdAt: { type: Date, default: Date.now },
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
