const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const auth = require("../middleware/authMiddleware");

// Route de recherche/filtres (doit être avant /:id pour éviter les conflits)
router.get("/filter", auth, bookController.filterBooks);

// Route pour obtenir les favoris
router.get("/favorites", auth, bookController.getFavoriteBooks);

// Routes pour ajouter aux favoris depuis les recommandations
router.post("/favorites", auth, bookController.addToFavorites);

// Toutes les routes ci-dessous nécessitent d'être connecté
router.post("/", auth, bookController.addBook);
router.get("/", auth, bookController.getBooks);
router.get("/:id", auth, bookController.getBookById);
router.put("/:id", auth, bookController.updateBook); // Modifier un livre
router.delete("/:id", auth, bookController.deleteBook); // Supprimer un livre

// Nouvelles routes pour les fonctionnalités
router.put("/:id/favorite", auth, bookController.toggleFavorite); // Toggle favoris
router.put("/:id/rating", auth, bookController.addRating); // Ajouter note/commentaire
router.put("/:id/notes", auth, bookController.addNotes); // Ajouter notes personnelles
router.put("/:id/progress", auth, bookController.updateProgress);

module.exports = router;
