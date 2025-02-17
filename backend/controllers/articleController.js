const db = require("../config/db");

exports.createArticle = (req, res) => {
    const { title, content, category_id } = req.body;
    const imagePath = req.file ? req.file.filename : null;
    const user_id = req.user.id; // Ambil user_id dari token JWT

    if (!title || !content || !category_id) {
        return res.status(400).json({ message: "All fields are required" });
    }

    db.query(
        "INSERT INTO articles (user_id, category_id, title, content, image) VALUES (?, ?, ?, ?, ?)",
        [user_id, category_id, title, content, imagePath],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Error creating article", error: err });
            res.status(201).json({ message: "Article created successfully!", articleId: result.insertId });
        }
    );
};

exports.getAllArticles = (req, res) => {
    db.query(
        `SELECT articles.*, categories.name_category, users.username 
         FROM articles 
         JOIN categories ON articles.category_id = categories.id
         JOIN users ON articles.user_id = users.id
         ORDER BY articles.created_at DESC`,

        (err, results) => {
            if (err) return res.status(500).json({ message: "Error retrieving articles", error: err });
            
            const articlesWithImageUrl = results.map(article => {
                article.imageUrl = `http://localhost:5000/uploads/${article.image}`;
                return article;
            });

            res.json(articlesWithImageUrl);
        }
    );
};

exports.getArticleById = (req, res) => {
    const { id } = req.params;

    db.query(
        `SELECT articles.*, categories.name_category, users.username 
         FROM articles 
         JOIN categories ON articles.category_id = categories.id
         JOIN users ON articles.user_id = users.id
         WHERE articles.id = ?`,
        [id],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Error retrieving article", error: err });
            if (results.length === 0) return res.status(404).json({ message: "Article not found" });
            res.json(results[0]);
        }
    );
};

exports.updateArticle = (req, res) => {
    const { id } = req.params;
    const { title, content, category_id } = req.body;
    const imagePath = req.file ? req.file.filename : null;
    const user_id = req.user.id;

    db.query("SELECT * FROM articles WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ message: "Error checking article", error: err });
        if (results.length === 0) return res.status(404).json({ message: "Article not found" });
        if (results[0].user_id !== user_id) return res.status(403).json({ message: "You are not authorized to update this article" });

        const updateFields = [];
        const updateValues = [];

        if (title) {
            updateFields.push("title = ?");
            updateValues.push(title);
        }
        if (content) {
            updateFields.push("content = ?");
            updateValues.push(content);
        }
        if (category_id) {
            updateFields.push("category_id = ?");
            updateValues.push(category_id);
        }
        if (imagePath) {
            updateFields.push("image = ?");
            updateValues.push(imagePath);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ message: "No changes provided" });
        }

        updateValues.push(id);

        db.query(
            `UPDATE articles SET ${updateFields.join(", ")} WHERE id = ?`,
            updateValues,
            (err, result) => {
                if (err) return res.status(500).json({ message: "Error updating article", error: err });
                res.json({ message: "Article updated successfully!" });
            }
        );
    });
};

exports.deleteArticle = (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    db.query("SELECT * FROM articles WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ message: "Error checking article", error: err });
        if (results.length === 0) return res.status(404).json({ message: "Article not found" });

        if (results[0].user_id !== user_id) {
            return res.status(403).json({ message: "You are not authorized to delete this article" });
        }

        db.query("DELETE FROM articles WHERE id = ?", [id], (err, result) => {
            if (err) return res.status(500).json({ message: "Error deleting article", error: err });
            res.json({ message: "Article deleted successfully!" });
        });
    });
};
