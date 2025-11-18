import express from "express";
const router = express.Router();

// Test route for class creation or listing
router.get("/", (req, res) => {
  res.send("Class routes working!");
});

export default router;
