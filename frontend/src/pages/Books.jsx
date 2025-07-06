import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BookComponent from "../components/BookComponent";
import AddBookForm from "../components/AddBookForm";
import { booksAPI } from "../utils/api";
import "./Books.css";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchBooks();
    }
  }, [user, navigate]);

  useEffect(() => {
    filterBooks();
  }, [books, searchTerm, statusFilter, genreFilter]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getAll();
      setBooks(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des livres:", err);
      setError("Impossible de charger les livres.");
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = books;

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter((book) => book.status === statusFilter);
    }

    // Filtrer par genre
    if (genreFilter !== "all") {
      filtered = filtered.filter((book) => book.category === genreFilter);
    }

    setFilteredBooks(filtered);
  };

  const handleBookAdded = (newBook) => {
    setBooks([...books, newBook]);
    setShowAddForm(false);
  };

  const handleBookDeleted = (bookId) => {
    setBooks(books.filter((book) => book._id !== bookId));
  };

  const handleBookUpdated = (updatedBook) => {
    setBooks(
      books.map((book) => (book._id === updatedBook._id ? updatedBook : book))
    );
  };

  const getUniqueGenres = () => {
    const genres = books.map((book) => book.category).filter(Boolean);
    return [...new Set(genres)];
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement de votre bibliothèque...</p>
      </div>
    );
  }

  return (
    <div className="books-page">
      <div className="page-header">
        <h1 className="page-title">Ma bibliothèque</h1>
        <p className="page-subtitle">
          Gérez et organisez votre collection de livres
        </p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un livre ou un auteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les statuts</option>
            <option value="à lire">À lire</option>
            <option value="en cours">En cours</option>
            <option value="terminé">Terminé</option>
          </select>

          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les genres</option>
            {getUniqueGenres().map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="primary-button"
        >
          {showAddForm ? "Annuler" : "Ajouter un livre"}
        </button>
      </div>

      {/* Statistiques de la bibliothèque */}
      <div className="library-stats">
        <div className="stat-item">
          <span className="stat-number">{filteredBooks.length}</span>
          <span className="stat-label">Livres affichés</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{books.length}</span>
          <span className="stat-label">Total livres</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {books.filter((book) => book.status === "terminé").length}
          </span>
          <span className="stat-label">Livres lus</span>
        </div>
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <div className="add-book-section">
          <div className="card">
            <h3 className="card-title">Ajouter un nouveau livre</h3>
            <AddBookForm
              onBookAdded={handleBookAdded}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && <div className="error-message">{error}</div>}

      {/* Liste des livres */}
      {filteredBooks.length === 0 && !loading && !error ? (
        <div className="empty-state">
          <h3>Aucun livre trouvé</h3>
          <p>
            {searchTerm || statusFilter !== "all" || genreFilter !== "all"
              ? "Essayez de modifier vos filtres de recherche."
              : "Commencez par ajouter votre premier livre !"}
          </p>
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map((book) => (
            <BookComponent
              key={book._id}
              book={book}
              onDelete={handleBookDeleted}
              onUpdate={handleBookUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;
