import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BookComponent from "../components/BookComponent";
import BookEditModal from "../components/BookEditModal";
import { booksAPI } from "../utils/api";
import "./Favorites.css";

const Favorites = () => {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

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
      const response = await booksAPI.getFavorites();
      setFavoriteBooks(response.data);
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

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };

  const handleToggleFavorite = async (bookId) => {
    try {
      const response = await booksAPI.toggleFavorite(bookId);
      // Si le livre n'est plus favori, on le retire de la liste
      if (!response.data.book.is_favorite) {
        setFavoriteBooks(favoriteBooks.filter((book) => book._id !== bookId));
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des favoris:", error);
    }
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
    <div className="bento-container">
      {/* En-tête */}
      <div className="bento-card bento-header">
        <h1 className="bento-title">Mes favoris</h1>
        <p className="bento-subtitle">
          Découvrez vos livres les mieux notés et vos coups de cœur
        </p>
      </div>

      {/* Statistiques des favoris */}
      <div className="bento-grid">
        <div className="bento-card bento-stat">
          <div className="stat-value">{favoriteBooks.length}</div>
          <div className="stat-label">Livres favoris</div>
        </div>
        <div className="bento-card bento-stat">
          <div className="stat-value">{getReadBooks().length}</div>
          <div className="stat-label">Favoris lus</div>
        </div>
        <div className="bento-card bento-stat">
          <div className="stat-value">{getAverageRating()}</div>
          <div className="stat-label">Note moyenne</div>
        </div>
      </div>

      {/* Genres préférés */}
      {getGenreStats().length > 0 && (
        <div className="bento-card bento-wide">
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
      {error && <div className="bento-card bento-error">{error}</div>}

      {/* Liste des livres favoris */}
      {favoriteBooks.length === 0 && !loading && !error ? (
        <div className="bento-card bento-empty">
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
        <div className="bento-card bento-wide">
          <h2 className="section-title">Vos livres favoris</h2>
          <div className="books-grid">
            {favoriteBooks.map((book) => (
              <BookComponent
                key={book._id}
                book={book}
                onDelete={handleBookDeleted}
                onUpdate={handleBookUpdated}
                onEdit={handleEditBook}
                onToggleFavorite={handleToggleFavorite}
                showRating={true}
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

export default Favorites;
