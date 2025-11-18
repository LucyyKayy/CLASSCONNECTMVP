import express from "express";
import Assignment from "../models/Assignment.js";
import { upload } from "../Middleware/upload.js";

const router = express.Router();

/**
 * @route   POST /api/assignments
 * @desc    Create new assignment (with optional file upload)
 */
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, description, dueDate, teacherId, className, language } = req.body;

    if (!title || !teacherId) {
      return res.status(400).json({ message: "Title and teacher ID are required." });
    }

    const filePath = req.file ? req.file.path : null;

    const newAssignment = new Assignment({
      title,
      description: description || "",
      dueDate: dueDate || null,
      teacherId,
      className: className || "",
      language: language || "English",
      file: filePath,
    });

    await newAssignment.save();
    res.status(201).json({
      message: "✅ Assignment created successfully",
      assignment: newAssignment,
    });
  } catch (err) {
    res.status(500).json({
      error: "❌ Server error during creation",
      details: err.message,
    });
  }
});

/**
 * @route   GET /api/assignments
 * @desc    Get all assignments
 */
router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({
      error: "❌ Server error while fetching assignments",
      details: err.message,
    });
  }
});

/**
 * @route   GET /api/assignments/:id
 * @desc    Get assignment by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(200).json(assignment);
  } catch (err) {
    res.status(500).json({
      error: "❌ Server error while fetching assignment",
      details: err.message,
    });
  }
});

/**
 * @route   PUT /api/assignments/:id
 * @desc    Update assignment
 */
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.file = req.file.path;
    }

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({
      message: "✅ Assignment updated successfully",
      assignment: updatedAssignment,
    });
  } catch (err) {
    res.status(500).json({
      error: "❌ Server error during update",
      details: err.message,
    });
  }
});

/**
 * @route   DELETE /api/assignments/:id
 * @desc    Delete one assignment by ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedAssignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!deletedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({ message: "✅ Assignment deleted successfully" });
  } catch (err) {
    res.status(500).json({
      error: "❌ Server error during deletion",
      details: err.message,
    });
  }
});

/**
 * @route   DELETE /api/assignments
 * @desc    Delete all assignments (use with caution)
 */
router.delete("/", async (req, res) => {
  try {
    await Assignment.deleteMany({});
    res.status(200).json({ message: "⚠️ All assignments deleted successfully" });
  } catch (err) {
    res.status(500).json({
      error: "❌ Server error while deleting all assignments",
      details: err.message,
    });
  }
});

export default router;
