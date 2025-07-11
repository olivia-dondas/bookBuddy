import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BookComponent from "../components/BookComponent";
import AddBookForm from "../components/AddBookForm";
import BookEditModal from "../components/BookEditModal";
import { booksAPI } from "../utils/api";
import bookEventManager, { EVENTS } from "../utils/bookEventManager";
import "./Books.css";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/login");
      } else {
        fetchBooks();
      }
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    filterBooks();
  }, [books, searchTerm, statusFilter, genreFilter]);

  // Écouter les événements de mise à jour des livres
  useEffect(() => {
    const unsubscribe = bookEventManager.subscribe(
      EVENTS.BOOK_UPDATED,
      (updatedBook) => {
        // Mettre à jour la liste des livres
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book._id === updatedBook._id ? updatedBook : book
          )
        );
      }
    );

    return unsubscribe;
  }, []);

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
    
    // Émettre un événement pour notifier les autres pages
    bookEventManager.emit(EVENTS.BOOK_DELETED, bookId);
  };

  const handleBookUpdated = (updatedBook) => {
    setBooks(
      books.map((book) => (book._id === updatedBook._id ? updatedBook : book))
    );

    // Émettre un événement pour notifier les autres pages
    bookEventManager.emit(EVENTS.BOOK_UPDATED, updatedBook);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };

  const handleToggleFavorite = async (bookId) => {
    try {
      const response = await booksAPI.toggleFavorite(bookId);
      const updatedBook = response.data.book;
      setBooks(books.map((book) => (book._id === bookId ? updatedBook : book)));

      // Émettre un événement pour notifier les autres pages
      bookEventManager.emit(EVENTS.BOOK_UPDATED, updatedBook);

      // Notification
      const notification = document.createElement("div");
      notification.className = "success-notification";
      notification.textContent = response.data.message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-hover);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des favoris:", error);
    }
  };

  const getUniqueGenres = () => {
    const genres = books.map((book) => book.category).filter(Boolean);
    return [...new Set(genres)];
  };

  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Vérification de l'authentification...</p>
      </div>
    );
  }

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
    <div className="bento-container">
      {/* En-tête */}
      <div className="bento-card bento-header">
        <h1 className="bento-title">Ma bibliothèque</h1>
        <p className="bento-subtitle">
          Gérez et organisez votre collection de livres
        </p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bento-card bento-filters">
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
      <div className="bento-grid">
        <div className="bento-card bento-stat">
          <div className="stat-value">{filteredBooks.length}</div>
          <div className="stat-label">Livres affichés</div>
        </div>
        <div className="bento-card bento-stat">
          <div className="stat-value">{books.length}</div>
          <div className="stat-label">Total livres</div>
        </div>
        <div className="bento-card bento-stat">
          <div className="stat-value">
            {books.filter((book) => book.status === "terminé").length}
          </div>
          <div className="stat-label">Livres lus</div>
        </div>
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <div className="bento-card bento-form">
          <h3 className="card-title">Ajouter un nouveau livre</h3>
          <AddBookForm
            onBookAdded={handleBookAdded}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Message d'erreur */}
      {error && <div className="bento-card bento-error">{error}</div>}

      {/* Liste des livres */}
      {filteredBooks.length === 0 && !loading && !error ? (
        <div className="bento-card bento-empty">
          <h3>Aucun livre trouvé</h3>
          <p>
            {searchTerm || statusFilter !== "all" || genreFilter !== "all"
              ? "Essayez de modifier vos filtres de recherche."
              : "Commencez par ajouter votre premier livre !"}
          </p>
        </div>
      ) : (
        <div className="bento-card bento-wide">
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <BookComponent
                key={book._id}
                book={book}
                onDelete={handleBookDeleted}
                onUpdate={handleBookUpdated}
                onEdit={() => {
                  setSelectedBook(book);
                  setShowEditModal(true);
                }}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal d'édition de livre */}
      {showEditModal && selectedBook && (
        <BookEditModal
          book={selectedBook}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleBookUpdated}
        />
      )}
    </div>
  );
};

export default Books;
