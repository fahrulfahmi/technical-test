const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, commentController.createComment);
router.get("/:article_id", commentController.getCommentsByArticle);
router.delete("/:id", verifyToken, commentController.deleteComment); // Tambahkan ini

module.exports = router;
