const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(bodyParser.json());

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// Rate limiting setup: max 5 requests per minute
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// Ensure 'uploads' folder exists
const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// File upload route
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ message: "File uploaded successfully", filename: req.file.filename });
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
