require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./config/db");
const path = require("path");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const articleRoutes = require("./routes/articleRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // Untuk menerima form-data
// app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Akses gambar
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/comments", commentRoutes);

// Test Server
app.get("/", (req, res) => res.send("API is running..."));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

