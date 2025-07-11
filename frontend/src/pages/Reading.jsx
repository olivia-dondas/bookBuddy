import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BookComponent from "../components/BookComponent";
import BookEditModal from "../components/BookEditModal";
import { booksAPI } from "../utils/api";
import bookEventManager, { EVENTS } from "../utils/bookEventManager";
import "./Reading.css";

const Reading = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingBook, setEditingBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Attendre que l'authentification soit vérifiée
    if (!authLoading) {
      if (!user) {
        navigate("/login");
      } else {
        fetchReadingBooks();
      }
    }
  }, [user, authLoading, navigate]);

  // Rafraîchir les données toutes les 30 secondes
  useEffect(() => {
    if (user && !authLoading) {
      const interval = setInterval(() => {
        fetchReadingBooks();
      }, 30000); // 30 secondes

      return () => clearInterval(interval);
    }
  }, [user, authLoading]);

  const fetchReadingBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getAll();
      console.log("Tous les livres récupérés:", response.data);

      const readingBooks = response.data.filter((book) => {
        // Vérifier plusieurs formats possibles pour "en cours"
        const status = book.status?.toLowerCase();
        return (
          status === "en_cours" ||
          status === "en cours" ||
          status === "reading" ||
          status === "current"
        );
      });
      console.log("Livres en cours de lecture:", readingBooks);
      console.log("Nombre de livres en cours:", readingBooks.length);

      setBooks(readingBooks);
    } catch (err) {
      console.error("Erreur lors du chargement des lectures:", err);
      setError("Impossible de charger vos lectures en cours.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookUpdated = (updatedBook) => {
    const status = updatedBook.status?.toLowerCase();
    const isReading =
      status === "en_cours" ||
      status === "en cours" ||
      status === "reading" ||
      status === "current";

    if (isReading) {
      setBooks(
        books.map((book) => (book._id === updatedBook._id ? updatedBook : book))
      );
    } else {
      // Si le livre n'est plus en cours, le retirer de la liste
      setBooks(books.filter((book) => book._id !== updatedBook._id));
    }

    // Émettre un événement pour notifier les autres pages
    bookEventManager.emit(EVENTS.BOOK_UPDATED, updatedBook);
  };

  const handleBookDeleted = (bookId) => {
    setBooks(books.filter((book) => book._id !== bookId));
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingBook(null);
    setIsModalOpen(false);
  };

  const handleSaveBook = (updatedBook) => {
    setBooks(
      books.map((book) => (book._id === updatedBook._id ? updatedBook : book))
    );
    // Refetch pour s'assurer que les données sont à jour
    fetchReadingBooks();

    // Émettre un événement pour notifier les autres pages
    bookEventManager.emit(EVENTS.BOOK_UPDATED, updatedBook);
  };

  const getTotalPages = () => {
    return books.reduce((total, book) => total + (book.pages || 0), 0);
  };

  const getReadPages = () => {
    return books.reduce((total, book) => total + (book.currentPage || 0), 0);
  };

  const getOverallProgress = () => {
    const total = getTotalPages();
    const read = getReadPages();
    return total > 0 ? Math.round((read / total) * 100) : 0;
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
        <p>Chargement de vos lectures...</p>
      </div>
    );
  }

  return (
    <div className="reading-page">
      {/* Header avec style bento */}
      <div className="bento-container">
        <div className="bento-card bento-card-wide">
          <div className="bento-header">
            <div>
              <h1 className="bento-title">Lectures en cours</h1>
              <p className="bento-subtitle">
                Suivez l'avancement de vos lectures actuelles
              </p>
            </div>
            <div className="bento-actions">
              <button
                onClick={fetchReadingBooks}
                className="bento-button bento-button-secondary"
                disabled={loading}
              >
                {loading ? "🔄" : "↻"} Actualiser
              </button>
              <span className="bento-icon">📚</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques en style bento */}
      <div className="bento-container">
        <div className="bento-grid-4">
          <div className="bento-card">
            <div className="bento-content">
              <div className="bento-stat">{books.length}</div>
              <div className="bento-label">Livres en cours</div>
            </div>
          </div>
          <div className="bento-card bento-card-accent">
            <div className="bento-content">
              <div className="bento-stat">{getReadPages()}</div>
              <div className="bento-label">Pages lues</div>
            </div>
          </div>
          <div className="bento-card bento-card-secondary">
            <div className="bento-content">
              <div className="bento-stat">{getTotalPages()}</div>
              <div className="bento-label">Pages totales</div>
            </div>
          </div>
          <div className="bento-card bento-card-dark">
            <div className="bento-content">
              <div className="bento-stat" style={{ color: "var(--accent)" }}>
                {getOverallProgress()}%
              </div>
              <div
                className="bento-label"
                style={{ color: "var(--text-secondary)" }}
              >
                Progression globale
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de progression en style bento */}
      {books.length > 0 && (
        <div className="bento-container">
          <div className="bento-card bento-card-wide bento-card-accent">
            <div className="bento-header">
              <h3 className="bento-title">Progression globale</h3>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${getOverallProgress()}%` }}
              ></div>
            </div>
            <p className="progress-text">
              {getReadPages()} / {getTotalPages()} pages ({getOverallProgress()}
              %)
            </p>
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="bento-container">
          <div
            className="bento-card"
            style={{ borderColor: "var(--error)", background: "#fef2f2" }}
          >
            <div className="error-message">{error}</div>
          </div>
        </div>
      )}

      {/* Liste des livres en cours */}
      {books.length === 0 && !loading && !error ? (
        <div className="bento-container">
          <div className="bento-card bento-card-wide">
            <div className="empty-state">
              <h3>Aucune lecture en cours</h3>
              <p>
                Commencez la lecture d'un livre depuis votre bibliothèque pour
                le voir apparaître ici.
              </p>
              <div className="bento-actions">
                <button
                  onClick={() => navigate("/books")}
                  className="bento-button bento-button-accent"
                >
                  Voir ma bibliothèque
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bento-container">
          <div className="bento-card bento-card-wide">
            <div className="bento-header">
              <h2 className="bento-title">Vos lectures actuelles</h2>
              <span className="bento-icon">📖</span>
            </div>
            <div className="books-grid">
              {books.map((book) => (
                <BookComponent
                  key={book._id}
                  book={book}
                  onDelete={handleBookDeleted}
                  onUpdate={handleBookUpdated}
                  onEdit={handleEditBook}
                  showProgress={true}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {editingBook && (
        <BookEditModal
          book={editingBook}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveBook}
        />
      )}
    </div>
  );
};

export default Reading;
