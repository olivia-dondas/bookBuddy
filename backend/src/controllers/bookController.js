const Book = require("../models/Book");
const User = require("../models/User");
const Reward = require("../models/Reward");

// Ajouter un livre
exports.addBook = async (req, res) => {
  try {
    const {
      user_id,
      title,
      author,
      cover_url,
      status,
      pages,
      category,
      last_page,
    } = req.body;
    const book = new Book({
      user_id,
      title,
      author,
      cover_url,
      status,
      pages,
      category,
      last_page,
    });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout du livre." });
  }
};

// Lister tous les livres de l'utilisateur
exports.getBooks = async (req, res) => {
  try {
    const { user_id } = req.query;
    const books = await Book.find({ user_id });
    res.json(books);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des livres." });
  }
};

// Détail d'un livre
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Livre non trouvé." });
    res.json(book);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du livre." });
  }
};

// Modifier un livre
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.userId },
      req.body,
      { new: true }
    );
    if (!book) return res.status(404).json({ message: "Livre non trouvé." });
    // Vérification et attribution du badge
    const { status } = req.body;
    if (status === "terminé") {
      // Compte les livres terminés de l'utilisateur
      const count = await Book.countDocuments({
        user_id: req.user.userId,
        status: "terminé",
      });
      // Vérifie si le badge n'a pas déjà été attribué
      const alreadyRewarded = await Reward.findOne({
        user_id: req.user.userId,
        type: "badge",
        label: "5 livres lus",
      });
      if (count >= 5 && !alreadyRewarded) {
        const reward = new Reward({
          user_id: req.user.userId,
          type: "badge",
          label: "5 livres lus",
        });
        await reward.save();
        // Tu peux aussi renvoyer une info dans la réponse si tu veux
      }
    }
    res.json(book);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de la modification du livre." });
  }
};

// Supprimer un livre
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.userId,
    });
    if (!book) return res.status(404).json({ message: "Livre non trouvé." });
    res.json({ message: "Livre supprimé." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du livre." });
  }
};

// Ajouter un livre aux favoris
exports.addFavorite = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $addToSet: { favorites: req.params.id } },
      { new: true }
    );
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    res.json({ message: "Livre ajouté aux favoris." });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout aux favoris." });
  }
};

// Retirer un livre des favoris
exports.removeFavorite = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { favorites: req.params.id } },
      { new: true }
    );
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    res.json({ message: "Livre retiré des favoris." });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors du retrait des favoris." });
  }
};

// Mettre à jour la progression d'un livre
exports.updateProgress = async (req, res) => {
  try {
    const { last_page, status } = req.body;
    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.userId },
      { last_page, status },
      { new: true }
    );
    if (!book) return res.status(404).json({ message: "Livre non trouvé." });

    // Attribution automatique du badge
    if (status === "terminé") {
      const count = await Book.countDocuments({
        user_id: req.user.userId,
        status: "terminé",
      });
      const alreadyRewarded = await Reward.findOne({
        user_id: req.user.userId,
        type: "badge",
        label: "5 livres lus",
      });
      if (count >= 5 && !alreadyRewarded) {
        const reward = new Reward({
          user_id: req.user.userId,
          type: "badge",
          label: "5 livres lus",
        });
        await reward.save();
      }
    }

    res.json(book);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de la progression." });
  }
};
