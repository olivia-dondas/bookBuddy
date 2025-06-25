const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const auth = require("../middleware/authMiddleware");

// Toutes les routes ci-dessous nécessitent d'être connecté
router.post("/", auth, bookController.addBook);
router.get("/", auth, bookController.getBooks);
router.get("/:id", auth, bookController.getBookById);
router.put("/:id", auth, bookController.updateBook); // Modifier un livre
router.delete("/:id", auth, bookController.deleteBook); // Supprimer un livre
router.post("/:id/favorite", auth, bookController.addFavorite);
router.delete("/:id/favorite", auth, bookController.removeFavorite);
router.put("/:id/progress", auth, bookController.updateProgress);

module.exports = router;
