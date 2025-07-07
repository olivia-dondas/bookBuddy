const RecommendedBook = require("../models/RecommendedBook");

// Récupérer toutes les recommandations
const getAllRecommendations = async (req, res) => {
  try {
    const { genre, search, limit = 20, featured = false } = req.query;

    let query = { is_active: true };

    // Filtrer par genre si spécifié
    if (genre) {
      query.genre = genre;
    }

    // Filtrer les livres mis en avant si demandé
    if (featured === "true") {
      query.is_featured = true;
    }

    let booksQuery = RecommendedBook.find(query);

    // Recherche textuelle si spécifiée
    if (search) {
      booksQuery = RecommendedBook.find({
        ...query,
        $text: { $search: search },
      });
    }

    const books = await booksQuery
      .limit(parseInt(limit))
      .sort({ rating: -1, createdAt: -1 });

    res.json({
      success: true,
      data: books,
      count: books.length,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des recommandations:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des recommandations",
    });
  }
};

// Récupérer les genres disponibles
const getGenres = async (req, res) => {
  try {
    const genres = await RecommendedBook.distinct("genre", { is_active: true });
    res.json({
      success: true,
      data: genres.sort(),
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des genres:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des genres",
    });
  }
};

// Récupérer un livre recommandé par ID
const getRecommendationById = async (req, res) => {
  try {
    const book = await RecommendedBook.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Livre recommandé non trouvé",
      });
    }

    res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du livre:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du livre",
    });
  }
};

// Ajouter un livre recommandé (pour l'admin)
const createRecommendation = async (req, res) => {
  try {
    const book = new RecommendedBook(req.body);
    await book.save();

    res.status(201).json({
      success: true,
      data: book,
      message: "Livre recommandé ajouté avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du livre recommandé:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout du livre recommandé",
    });
  }
};

module.exports = {
  getAllRecommendations,
  getGenres,
  getRecommendationById,
  createRecommendation,
};
