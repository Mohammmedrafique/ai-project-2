const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const axios = require("axios");
const mongoose = require("mongoose");
const fs = require("fs");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Create a schema for our history items
const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  input: String,
  summary: String,
  timestamp: { type: Date, default: Date.now },
});

const History = mongoose.model("History", historySchema);

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

async function summarizeText(text) {
  const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
    contents: [
      {
        parts: [
          {
            text: `Summarize the following text:\n\n${text}`,
          },
        ],
      },
    ],
  });
  return response.data.candidates[0].content.parts[0].text;
}

// Summarize text route
app.post("/api/summarize-text", async (req, res) => {
  try {
    const { text, userId } = req.body; // Accept userId in the request body
    if (!text || !userId) {
      return res.status(400).json({ error: "Text and userId are required" });
    }
    const summary = await summarizeText(text);

    // Save to MongoDB
    const historyItem = new History({ userId, input: text, summary });
    await historyItem.save();

    res.json({ summary });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while summarizing the text" });
  }
});

// Summarize PDF route
app.post("/api/summarize-pdf", upload.single("pdf"), async (req, res) => {
  try {
    const { userId } = req.body; // Accept userId in the request body
    if (!req.file || !userId) {
      return res
        .status(400)
        .json({ error: "PDF file and userId are required" });
    }
    const pdfFile = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfFile);
    fs.unlinkSync(req.file.path);
    const summary = await summarizeText(pdfData.text);

    // Save to MongoDB
    const historyItem = new History({ userId, input: "PDF File", summary });
    await historyItem.save();

    res.json({ summary });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the PDF" });
  }
});

// Get history by userId
app.get("/api/history", async (req, res) => {
  try {
    const { userId } = req.query; // Accept userId as a query parameter
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const history = await History.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10);
    res.json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "An error occurred while fetching history" });
  }
});

// Get a specific history item by id
app.get("/api/history/:id", async (req, res) => {
  try {
    const { userId } = req.query; // Accept userId as a query parameter
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const historyItem = await History.findOne({ _id: req.params.id, userId });
    if (!historyItem) {
      return res.status(404).json({ error: "History item not found" });
    }
    res.json(historyItem);
  } catch (error) {
    console.error("Error fetching history item:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the history item" });
  }
});

app.use("/api", require("./routes/auth"));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
