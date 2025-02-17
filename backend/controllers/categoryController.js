const db = require("../config/db");

exports.getAllCategories = (req, res) => {
    db.query("SELECT * FROM categories", (err, results) => {
        if (err) return res.status(500).json({ message: "Error retrieving categories" });
        res.json(results);
    });
};
