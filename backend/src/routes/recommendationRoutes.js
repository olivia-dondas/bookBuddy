const express = require("express");
const router = express.Router();
const {
  getAllRecommendations,
  getGenres,
  getRecommendationById,
  createRecommendation,
} = require("../controllers/recommendationController");

// Routes publiques (pas besoin d'authentification pour les recommandations)
router.get("/", getAllRecommendations);
router.get("/genres", getGenres);
router.get("/:id", getRecommendationById);

// Route pour ajouter des recommandations (pour l'admin - on peut ajouter l'auth plus tard)
router.post("/", createRecommendation);

module.exports = router;
