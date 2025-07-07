const Book = require("../models/Book");
const User = require("../models/User");
const Reward = require("../models/Reward");

// Ajouter un livre
exports.addBook = async (req, res) => {
  try {
    const { title, author, cover_url, status, pages, category, last_page } =
      req.body;
    const book = new Book({
      user_id: req.user.userId, // Utiliser l'ID de l'utilisateur connecté
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
    // Utiliser l'ID de l'utilisateur depuis le token JWT
    const books = await Book.find({ user_id: req.user.userId });
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

    const { status } = req.body;
    if (status === "terminé") {
      const user = await User.findById(req.user.userId);
      if (user) {
        const booksReadCount = await Book.countDocuments({
          user_id: req.user.userId,
          status: "terminé",
        });
        user.booksReadCount = booksReadCount;
        user.level = Math.floor(booksReadCount / 5) + 1;
        await user.save();

        // Logique de badge existante
        const alreadyRewarded = await Reward.findOne({
          user_id: req.user.userId,
          type: "badge",
          label: "5 livres lus",
        });
        if (booksReadCount >= 5 && !alreadyRewarded) {
          const reward = new Reward({
            user_id: req.user.userId,
            type: "badge",
            label: "5 livres lus",
          });
          await reward.save();
        }
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

    // Si le livre est terminé, on met à jour le profil utilisateur
    if (status === "terminé") {
      const user = await User.findById(req.user.userId);
      if (user) {
        // On recompte pour être sûr
        const booksReadCount = await Book.countDocuments({
          user_id: req.user.userId,
          status: "terminé",
        });
        user.booksReadCount = booksReadCount;
        user.level = Math.floor(booksReadCount / 5) + 1;
        await user.save();

        // Logique de badge existante
        const alreadyRewarded = await Reward.findOne({
          user_id: req.user.userId,
          type: "badge",
          label: "5 livres lus",
        });
        if (booksReadCount >= 5 && !alreadyRewarded) {
          const reward = new Reward({
            user_id: req.user.userId,
            type: "badge",
            label: "5 livres lus",
          });
          await reward.save();
        }
      }
    }

    res.json(book);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de la progression." });
  }
};

// Recherche et filtres dynamiques
exports.filterBooks = async (req, res) => {
  try {
    const { title, author, category, status } = req.query;

    // Construction du filtre de base (utilisateur connecté)
    const filter = { user_id: req.user.userId };

    // Ajout des filtres optionnels avec recherche insensible à la casse
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }
    if (author) {
      filter.author = { $regex: author, $options: "i" };
    }
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }
    if (status) {
      filter.status = status;
    }

    const books = await Book.find(filter);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la recherche de livres." });
  }
};

// Ajouter/Retirer des favoris
exports.toggleFavorite = async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      user_id: req.user.userId,
    });

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé." });
    }

    book.is_favorite = !book.is_favorite;
    await book.save();

    res.json({
      message: book.is_favorite
        ? "Livre ajouté aux favoris"
        : "Livre retiré des favoris",
      book,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour des favoris." });
  }
};

// Ajouter une note/rating
exports.addRating = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (rating && (rating < 1 || rating > 5)) {
      return res
        .status(400)
        .json({ message: "La note doit être entre 1 et 5." });
    }

    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.userId },
      { rating, comment },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé." });
    }

    res.json({ message: "Note et commentaire ajoutés avec succès", book });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout de la note." });
  }
};

// Ajouter des notes personnelles
exports.addNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.userId },
      { notes },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé." });
    }

    res.json({ message: "Notes ajoutées avec succès", book });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout des notes." });
  }
};

// Obtenir les livres favoris
exports.getFavoriteBooks = async (req, res) => {
  try {
    const books = await Book.find({
      user_id: req.user.userId,
      is_favorite: true,
    });
    res.json(books);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des favoris." });
  }
};

// Ajouter un livre aux favoris depuis les recommandations
exports.addToFavorites = async (req, res) => {
  try {
    const { title, author, cover_url, category, pages, genre } = req.body;

    // Vérifier si le livre existe déjà dans la bibliothèque
    const existingBook = await Book.findOne({
      user_id: req.user.userId,
      title: title,
      author: author,
    });

    if (existingBook) {
      // Le livre existe, on l'ajoute aux favoris
      existingBook.is_favorite = true;
      await existingBook.save();
      return res.json({
        message: "Livre ajouté aux favoris",
        book: existingBook,
      });
    }

    // Le livre n'existe pas, on l'ajoute à la bibliothèque ET aux favoris
    const newBook = new Book({
      user_id: req.user.userId,
      title,
      author,
      cover_url,
      category: category || genre,
      pages,
      status: "à lire",
      is_favorite: true,
    });

    await newBook.save();
    res.status(201).json({
      message: "Livre ajouté à la bibliothèque et aux favoris",
      book: newBook,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout aux favoris." });
  }
};
