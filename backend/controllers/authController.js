const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = (req, res) => {
    const { username, email, password } = req.body;

    db.query("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (results.length > 0) return res.status(400).json({ message: "Username or Email already exists" });

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ message: "Error hashing password" });

            db.query(
                "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                [username, email, hash],
                (err, result) => {
                    if (err) return res.status(500).json({ message: "Error registering user" });
                    res.status(201).json({ message: "User registered successfully!" });
                }
            );
        });
    });
};

// Login
exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (results.length === 0) return res.status(401).json({ message: "Invalid email or password" });

        bcrypt.compare(password, results[0].password, (err, match) => {
            if (!match) return res.status(401).json({ message: "Invalid email or password" });

            const token = jwt.sign(
                { id: results[0].id, username: results[0].username },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.json({ message: "Login successful", token });
        });
    });
};

exports.getUser = (req, res) => {
    const userId = req.user.id;

    db.query("SELECT id, username, email FROM users WHERE id = ?", [userId], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (results.length === 0) return res.status(404).json({ message: "User not found" });

        res.json(results[0]);
    });
};
