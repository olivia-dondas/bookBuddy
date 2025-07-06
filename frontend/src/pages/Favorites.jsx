import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BookComponent from "../components/BookComponent";
import { booksAPI } from "../utils/api";
import "./Favorites.css";

const Favorites = () => {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchFavoriteBooks();
    }
  }, [user, navigate]);

  const fetchFavoriteBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getAll();
      // Pour l'instant, on considère les livres avec une note >= 4 comme favoris
      // Plus tard, on pourra ajouter un système de favoris explicite
      const favorites = response.data.filter(
        (book) => book.rating >= 4 || book.isFavorite
      );
      setFavoriteBooks(favorites);
    } catch (err) {
      console.error("Erreur lors du chargement des favoris:", err);
      setError("Impossible de charger vos livres favoris.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookUpdated = (updatedBook) => {
    setFavoriteBooks(
      favoriteBooks.map((book) =>
        book._id === updatedBook._id ? updatedBook : book
      )
    );
  };

  const handleBookDeleted = (bookId) => {
    setFavoriteBooks(favoriteBooks.filter((book) => book._id !== bookId));
  };

  const getGenreStats = () => {
    const genres = {};
    favoriteBooks.forEach((book) => {
      if (book.genre) {
        genres[book.genre] = (genres[book.genre] || 0) + 1;
      }
    });
    return Object.entries(genres).sort((a, b) => b[1] - a[1]);
  };

  const getAverageRating = () => {
    if (favoriteBooks.length === 0) return 0;
    const total = favoriteBooks.reduce(
      (sum, book) => sum + (book.rating || 0),
      0
    );
    return (total / favoriteBooks.length).toFixed(1);
  };

  const getReadBooks = () => {
    return favoriteBooks.filter((book) => book.status === "lu");
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement de vos favoris...</p>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="page-header">
        <h1 className="page-title">Mes favoris</h1>
        <p className="page-subtitle">
          Découvrez vos livres les mieux notés et vos coups de cœur
        </p>
      </div>

      {/* Statistiques des favoris */}
      <div className="favorites-stats">
        <div className="stat-card">
          <div className="stat-value">{favoriteBooks.length}</div>
          <div className="stat-label">Livres favoris</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{getReadBooks().length}</div>
          <div className="stat-label">Favoris lus</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{getAverageRating()}</div>
          <div className="stat-label">Note moyenne</div>
        </div>
      </div>

      {/* Genres préférés */}
      {getGenreStats().length > 0 && (
        <div className="genre-stats">
          <h3>Vos genres préférés</h3>
          <div className="genre-list">
            {getGenreStats()
              .slice(0, 5)
              .map(([genre, count]) => (
                <div key={genre} className="genre-item">
                  <span className="genre-name">{genre}</span>
                  <span className="genre-count">
                    {count} livre{count > 1 ? "s" : ""}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && <div className="error-message">{error}</div>}

      {/* Liste des livres favoris */}
      {favoriteBooks.length === 0 && !loading && !error ? (
        <div className="empty-state">
          <h3>Aucun livre favori</h3>
          <p>
            Ajoutez des notes élevées à vos livres pour les voir apparaître dans
            vos favoris.
          </p>
          <button onClick={() => navigate("/books")} className="primary-button">
            Voir ma bibliothèque
          </button>
        </div>
      ) : (
        <div className="favorites-section">
          <h2 className="section-title">Vos livres favoris</h2>
          <div className="books-grid">
            {favoriteBooks.map((book) => (
              <BookComponent
                key={book._id}
                book={book}
                onDelete={handleBookDeleted}
                onUpdate={handleBookUpdated}
                showRating={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
