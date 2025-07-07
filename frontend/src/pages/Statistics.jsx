import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { booksAPI } from "../utils/api";
import "./Statistics.css";

const Statistics = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchBooks();
    }
  }, [user, navigate]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getAll();
      setBooks(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des statistiques:", err);
      setError("Impossible de charger les statistiques.");
    } finally {
      setLoading(false);
    }
  };

  // Statistiques générales
  const getGeneralStats = () => {
    const readBooks = books.filter((book) => book.status === "terminé");
    const currentBooks = books.filter((book) => book.status === "en cours");
    const toReadBooks = books.filter((book) => book.status === "à lire");
    const totalPages = books.reduce((sum, book) => sum + (book.pages || 0), 0);
    const readPages = readBooks.reduce(
      (sum, book) => sum + (book.pages || 0),
      0
    );

    return {
      totalBooks: books.length,
      readBooks: readBooks.length,
      currentBooks: currentBooks.length,
      toReadBooks: toReadBooks.length,
      totalPages,
      readPages,
      completionRate:
        books.length > 0
          ? Math.round((readBooks.length / books.length) * 100)
          : 0,
    };
  };

  // Statistiques par genre
  const getGenreStats = () => {
    const genres = {};
    books.forEach((book) => {
      if (book.category) {
        if (!genres[book.category]) {
          genres[book.category] = { total: 0, read: 0 };
        }
        genres[book.category].total += 1;
        if (book.status === "terminé") {
          genres[book.category].read += 1;
        }
      }
    });

    return Object.entries(genres)
      .map(([genre, stats]) => ({
        genre,
        total: stats.total,
        read: stats.read,
        percentage: Math.round((stats.read / stats.total) * 100),
      }))
      .sort((a, b) => b.total - a.total);
  };

  // Statistiques par auteur
  const getAuthorStats = () => {
    const authors = {};
    books.forEach((book) => {
      if (book.author) {
        if (!authors[book.author]) {
          authors[book.author] = { total: 0, read: 0 };
        }
        authors[book.author].total += 1;
        if (book.status === "terminé") {
          authors[book.author].read += 1;
        }
      }
    });

    return Object.entries(authors)
      .map(([author, stats]) => ({
        author,
        total: stats.total,
        read: stats.read,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10); // Top 10 auteurs
  };

  // Statistiques de notes
  const getRatingStats = () => {
    const ratedBooks = books.filter((book) => book.rating && book.rating > 0);
    if (ratedBooks.length === 0) return null;

    const ratings = {};
    ratedBooks.forEach((book) => {
      const rating = Math.floor(book.rating);
      ratings[rating] = (ratings[rating] || 0) + 1;
    });

    const average =
      ratedBooks.reduce((sum, book) => sum + book.rating, 0) /
      ratedBooks.length;

    return {
      average: average.toFixed(1),
      total: ratedBooks.length,
      distribution: ratings,
    };
  };

  const generalStats = getGeneralStats();
  const genreStats = getGenreStats();
  const authorStats = getAuthorStats();
  const ratingStats = getRatingStats();

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <div className="bento-container">
      {/* En-tête */}
      <div className="bento-card bento-header">
        <h1 className="bento-title">Statistiques</h1>
        <p className="bento-subtitle">
          Analysez vos habitudes de lecture et découvrez vos tendances
        </p>
      </div>

      {/* Statistiques générales */}
      <div className="bento-grid">
        <div className="bento-card bento-stat">
          <div className="stat-value">{generalStats.totalBooks}</div>
          <div className="stat-label">Livres total</div>
        </div>
        <div className="bento-card bento-stat">
          <div className="stat-value">{generalStats.readBooks}</div>
          <div className="stat-label">Livres lus</div>
        </div>
        <div className="bento-card bento-stat">
          <div className="stat-value">{generalStats.currentBooks}</div>
          <div className="stat-label">En cours</div>
        </div>
        <div className="bento-card bento-stat">
          <div className="stat-value">{generalStats.toReadBooks}</div>
          <div className="stat-label">À lire</div>
        </div>
        <div className="bento-card bento-stat">
          <div className="stat-value">{generalStats.readPages}</div>
          <div className="stat-label">Pages lues</div>
        </div>
        <div className="bento-card bento-stat">
          <div className="stat-value">{generalStats.completionRate}%</div>
          <div className="stat-label">Taux de lecture</div>
        </div>
      </div>

      {/* Statistiques par genre */}
      {genreStats.length > 0 && (
        <div className="bento-card bento-wide">
          <h2 className="section-title">Répartition par genre</h2>
          <div className="genre-stats">
            {genreStats.map(({ genre, total, read, percentage }) => (
              <div key={genre} className="genre-stat-item">
                <div className="genre-info">
                  <span className="genre-name">{genre}</span>
                  <span className="genre-count">
                    {read}/{total} lus ({percentage}%)
                  </span>
                </div>
                <div className="genre-progress">
                  <div
                    className="genre-progress-bar"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top auteurs */}
      {authorStats.length > 0 && (
        <div className="bento-card bento-wide">
          <h2 className="section-title">Auteurs les plus lus</h2>
          <div className="author-stats">
            {authorStats.map(({ author, total, read }) => (
              <div key={author} className="author-stat-item">
                <span className="author-name">{author}</span>
                <span className="author-count">
                  {total} livre{total > 1 ? "s" : ""} ({read} lu
                  {read > 1 ? "s" : ""})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistiques de notes */}
      {ratingStats && (
        <div className="bento-card bento-wide">
          <h2 className="section-title">Notes attribuées</h2>
          <div className="rating-stats">
            <div className="rating-overview">
              <div className="average-rating">
                <span className="rating-value">{ratingStats.average}</span>
                <span className="rating-label">Note moyenne</span>
              </div>
              <div className="total-ratings">
                <span className="rating-value">{ratingStats.total}</span>
                <span className="rating-label">Livres notés</span>
              </div>
            </div>
            <div className="rating-distribution">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="rating-bar">
                  <span className="rating-stars">{"★".repeat(rating)}</span>
                  <div className="rating-progress">
                    <div
                      className="rating-progress-bar"
                      style={{
                        width: `${
                          ((ratingStats.distribution[rating] || 0) /
                            ratingStats.total) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="rating-count">
                    {ratingStats.distribution[rating] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && <div className="bento-card bento-error">{error}</div>}

      {/* État vide */}
      {books.length === 0 && !loading && !error && (
        <div className="bento-card bento-empty">
          <h3>Aucune donnée disponible</h3>
          <p>
            Ajoutez des livres à votre bibliothèque pour voir vos statistiques.
          </p>
          <button onClick={() => navigate("/books")} className="primary-button">
            Ajouter des livres
          </button>
        </div>
      )}
    </div>
  );
};

export default Statistics;
