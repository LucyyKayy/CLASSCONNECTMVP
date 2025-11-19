// backend/server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import axios from "axios";

import authRoutes from "./routes/authRoutes.js";
import classRoutes from "./routes/classes.js";
import AssignmentRoutes from "./routes/AssignmentRoutes.js";

dotenv.config();
const app = express();

// === 🌐 CORS Setup for Netlify Frontend ===
app.use(cors({
  origin: "https://classconnectprojectt.netlify.app", // Netlify frontend
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

app.use(express.json());

// File path setup for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === 📂 File Upload Setup === //
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// === 📡 Upload Route === //
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    res.json({
      success: true,
      message: "File uploaded successfully",
      filePath: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "File upload failed" });
  }
});

// === 🧭 Main Routes === //
app.use("/api/auth", authRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/assignments", AssignmentRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===========================================
// ⭐ LibreTranslate (with auto fallback)
// ===========================================
const TRANSLATE_URLS = [
  "https://translate.argosopentech.com/translate",
  "https://libretranslate.com/translate"
];

// 1️⃣ TEXT → TEXT
app.post("/api/translate-text", async (req, res) => {
  const { text, targetLang } = req.body;
  for (const url of TRANSLATE_URLS) {
    try {
      const response = await axios.post(
        url,
        { q: text, source: "auto", target: targetLang, format: "text" },
        { headers: { "Content-Type": "application/json", "accept": "application/json" } }
      );
      return res.json({ translated: response.data.translatedText });
    } catch (err) {
      console.log(`⚠️ LibreTranslate failed at ${url}, trying next...`);
    }
  }
  res.status(500).json({ error: "Translation failed (all services unavailable)." });
});

// 2️⃣ SPEECH → TEXT (placeholder)
app.post("/api/stt", upload.single("audio"), async (req, res) => {
  try {
    const audioPath = req.file.path;
    const dummyText = "This is a placeholder transcription.";
    fs.unlinkSync(audioPath);
    res.json({ text: dummyText });
  } catch (err) {
    console.error("STT error:", err.message);
    res.status(500).json({ error: "Speech-to-text failed" });
  }
});

// 3️⃣ TEXT → SPEECH (placeholder)
app.post("/api/tts", async (req, res) => {
  const { text, lang = "en" } = req.body;
  try {
    const dummyAudio = fs.readFileSync(path.join(__dirname, "uploads/dummy.wav"));
    res.set({ "Content-Type": "audio/wav" });
    res.send(dummyAudio);
  } catch (err) {
    console.error("TTS error:", err.message);
    res.status(500).json({ error: "Text-to-speech failed" });
  }
});

// 4️⃣ FULL VOICE → VOICE
app.post("/api/translate-voice", upload.single("audio"), async (req, res) => {
  try {
    const { targetLang } = req.body;
    const audioPath = req.file.path;
    const text = "This is a placeholder transcription.";
    let translatedText = "Translation not available";

    for (const url of TRANSLATE_URLS) {
      try {
        const response = await axios.post(
          url,
          { q: text, source: "auto", target: targetLang, format: "text" },
          { headers: { "Content-Type": "application/json", "accept": "application/json" } }
        );
        translatedText = response.data.translatedText;
        break;
      } catch {}
    }

    const dummyAudio = fs.readFileSync(path.join(__dirname, "uploads/dummy.wav"));
    fs.unlinkSync(audioPath);
    res.set({ "Content-Type": "audio/wav" });
    res.send(dummyAudio);
  } catch (err) {
    console.error("Voice translation error:", err.message);
    res.status(500).json({ error: "Voice translation failed" });
  }
});

// =========================================
// 📥 DOWNLOAD EXERCISES
// =========================================
app.post("/api/download-exercise", async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "No content provided." });

    const fileName = `exercise-${Date.now()}.txt`;
    const filePath = path.join(__dirname, "uploads", fileName);

    fs.writeFileSync(filePath, content, "utf8");

    res.download(filePath, fileName, (err) => {
      if (err) console.error("Download error:", err);
      setTimeout(() => fs.unlinkSync(filePath), 3000); // delete after sending
    });
  } catch (err) {
    console.error("Download exercise error:", err.message);
    res.status(500).json({ error: "Failed to generate exercise file." });
  }
});

// =========================================
// ✅ Health Check (for Render deployment)
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// 💾 Connect DB and Start Server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ DB connection error:", err));
