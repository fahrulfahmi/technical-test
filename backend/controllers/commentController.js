const db = require("../config/db");

exports.createComment = (req, res) => {
    const { article_id, content } = req.body;
    const user_id = req.user.id;

    db.query("INSERT INTO comments (user_id, article_id, content) VALUES (?, ?, ?)", 
        [user_id, article_id, content], 
        (err, result) => {
            if (err) return res.status(500).json({ message: "Error creating comment" });
            res.json({ message: "Comment added successfully!" });
        }
    );
};

exports.getCommentsByArticle = (req, res) => {
    const { article_id } = req.params;

    db.query("SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE article_id = ?", 
        [article_id], 
        (err, results) => {
            if (err) return res.status(500).json({ message: "Error retrieving comments" });
            res.json(results);
        }
    );
};

exports.deleteComment = (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    db.query("DELETE FROM comments WHERE id = ? AND user_id = ?", 
        [id, user_id], 
        (err, result) => {
            if (err) return res.status(500).json({ message: "Error deleting comment" });
            res.json({ message: "Comment deleted successfully!" });
        }
    );
};
