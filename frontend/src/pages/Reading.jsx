import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BookComponent from "../components/BookComponent";
import { booksAPI } from "../utils/api";
import "./Reading.css";

const Reading = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchReadingBooks();
    }
  }, [user, navigate]);

  const fetchReadingBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getAll();
      const readingBooks = response.data.filter(
        (book) => book.status === "en_cours"
      );
      setBooks(readingBooks);
    } catch (err) {
      console.error("Erreur lors du chargement des lectures:", err);
      setError("Impossible de charger vos lectures en cours.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookUpdated = (updatedBook) => {
    if (updatedBook.status === "en_cours") {
      setBooks(
        books.map((book) => (book._id === updatedBook._id ? updatedBook : book))
      );
    } else {
      // Si le livre n'est plus en cours, le retirer de la liste
      setBooks(books.filter((book) => book._id !== updatedBook._id));
    }
  };

  const handleBookDeleted = (bookId) => {
    setBooks(books.filter((book) => book._id !== bookId));
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
      <div className="page-header">
        <h1 className="page-title">Lectures en cours</h1>
        <p className="page-subtitle">
          Suivez l'avancement de vos lectures actuelles
        </p>
      </div>

      {/* Statistiques de progression */}
      <div className="progress-stats">
        <div className="stat-card">
          <div className="stat-value">{books.length}</div>
          <div className="stat-label">Livres en cours</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{getReadPages()}</div>
          <div className="stat-label">Pages lues</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{getTotalPages()}</div>
          <div className="stat-label">Pages totales</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{getOverallProgress()}%</div>
          <div className="stat-label">Progression globale</div>
        </div>
      </div>

      {/* Barre de progression globale */}
      {books.length > 0 && (
        <div className="global-progress">
          <h3>Progression globale</h3>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${getOverallProgress()}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {getReadPages()} / {getTotalPages()} pages ({getOverallProgress()}%)
          </p>
        </div>
      )}

      {/* Message d'erreur */}
      {error && <div className="error-message">{error}</div>}

      {/* Liste des livres en cours */}
      {books.length === 0 && !loading && !error ? (
        <div className="empty-state">
          <h3>Aucune lecture en cours</h3>
          <p>
            Commencez la lecture d'un livre depuis votre bibliothèque pour le
            voir apparaître ici.
          </p>
          <button onClick={() => navigate("/books")} className="primary-button">
            Voir ma bibliothèque
          </button>
        </div>
      ) : (
        <div className="reading-section">
          <h2 className="section-title">Vos lectures actuelles</h2>
          <div className="books-grid">
            {books.map((book) => (
              <BookComponent
                key={book._id}
                book={book}
                onDelete={handleBookDeleted}
                onUpdate={handleBookUpdated}
                showProgress={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reading;
