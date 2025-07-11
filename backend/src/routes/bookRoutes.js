const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const auth = require("../middleware/authMiddleware");
const {
  upload,
  deleteImage,
  getImageUrl,
} = require("../middleware/imageHandler");

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

// Routes pour la gestion des images
router.post("/upload-cover", auth, upload.single("cover"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier fourni" });
    }

    const filename = req.file.filename;
    const coverUrl = getImageUrl(req, filename);

    // Optionnel: Mettre à jour le livre avec la nouvelle couverture
    if (req.body.bookId) {
      await Book.findByIdAndUpdate(req.body.bookId, { cover: filename });
    }

    res.json({
      message: "Image uploadée avec succès",
      filename: filename,
      coverUrl: coverUrl,
    });
  } catch (error) {
    console.error("Erreur upload:", error);
    res.status(500).json({ message: "Erreur lors de l'upload" });
  }
});

router.delete("/delete-cover", auth, async (req, res) => {
  try {
    const { filename } = req.body;

    if (!filename) {
      return res.status(400).json({ message: "Nom de fichier requis" });
    }

    const imagePath = path.join(__dirname, "../../uploads/covers", filename);
    deleteImage(imagePath);

    res.json({ message: "Image supprimée avec succès" });
  } catch (error) {
    console.error("Erreur suppression:", error);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
});

module.exports = router;
