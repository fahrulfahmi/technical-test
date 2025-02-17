const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/", verifyToken, upload.single("image"), articleController.createArticle);
router.get("/", articleController.getAllArticles);
router.get("/:id", articleController.getArticleById);
router.put("/:id", verifyToken, upload.single("image"), articleController.updateArticle);
router.delete("/:id", verifyToken, articleController.deleteArticle);

module.exports = router;
