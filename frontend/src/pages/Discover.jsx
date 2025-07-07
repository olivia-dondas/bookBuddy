import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { booksAPI, recommendationsAPI } from "../utils/api";
import "./Discover.css";

const Discover = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [defaultRecommendations, setDefaultRecommendations] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [addingBooks, setAddingBooks] = useState(new Set());

  const { user } = useAuth();
  const navigate = useNavigate();

  // Charger les données initiales
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadInitialData = async () => {
      try {
        setInitialLoading(true);

        // Charger les genres et les recommandations par défaut en parallèle
        const [genresResponse, recommendationsResponse] = await Promise.all([
          recommendationsAPI.getGenres(),
          recommendationsAPI.getAll({ limit: 12, featured: false }),
        ]);

        setGenres(genresResponse.data.data);
        setDefaultRecommendations(recommendationsResponse.data.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialData();
  }, [user, navigate]);

  // Fonction pour déterminer l'URL de la couverture
  const getCoverUrl = (book) => {
    if (book.cover_url) {
      // Si c'est une URL complète (http/https), on l'utilise directement
      if (book.cover_url.startsWith("http")) {
        return book.cover_url;
      }
      // Si c'est un chemin local, on l'adapte
      if (book.cover_url.startsWith("/uploads/")) {
        return `http://localhost:5055${book.cover_url}`;
      }
      // Si c'est juste un nom de fichier, on l'utilise depuis le dossier public
      return `/images/covers/${book.cover_url}`;
    }
    return null;
  };

  // Fonction pour la recherche
  const handleSearch = async () => {
    if (!searchTerm && !selectedGenre) {
      setRecommendations([]);
      return;
    }

    setLoading(true);

    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedGenre) params.genre = selectedGenre;
      params.limit = 20;

      const response = await recommendationsAPI.getAll(params);
      setRecommendations(response.data.data);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour ajouter un livre à la bibliothèque
  const handleAddToLibrary = async (book) => {
    if (addingBooks.has(book._id)) return; // Éviter les doublons

    setAddingBooks((prev) => new Set(prev).add(book._id));

    try {
      const bookData = {
        title: book.title,
        author: book.author,
        cover_url: book.cover_url,
        category: book.category || book.genre,
        pages: book.pages,
        status: "à lire",
      };

      await booksAPI.create(bookData);

      // Notification de succès
      const notification = document.createElement("div");
      notification.className = "success-notification";
      notification.textContent = `"${book.title}" a été ajouté à votre bibliothèque !`;
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

      setTimeout(() => {
        notification.remove();
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de l'ajout du livre:", error);

      // Notification d'erreur
      const notification = document.createElement("div");
      notification.className = "error-notification";
      notification.textContent =
        error.response?.data?.message || "Erreur lors de l'ajout du livre";
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--error);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-hover);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
      `;

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 3000);
    } finally {
      setAddingBooks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(book._id);
        return newSet;
      });
    }
  };

  // Fonction pour ajouter un livre aux favoris
  const handleAddToFavorites = async (book) => {
    if (addingBooks.has(book._id)) return; // Éviter les doublons

    setAddingBooks((prev) => new Set(prev).add(book._id));

    try {
      const bookData = {
        title: book.title,
        author: book.author,
        cover_url: book.cover_url,
        category: book.category || book.genre,
        pages: book.pages,
        genre: book.genre,
      };

      await booksAPI.addToFavorites(bookData);

      // Notification de succès
      const notification = document.createElement("div");
      notification.className = "success-notification";
      notification.textContent = `"${book.title}" a été ajouté à vos favoris !`;
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

      setTimeout(() => {
        notification.remove();
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris:", error);

      // Notification d'erreur
      const notification = document.createElement("div");
      notification.className = "error-notification";
      notification.textContent =
        error.response?.data?.message || "Erreur lors de l'ajout aux favoris";
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--error);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-hover);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
      `;

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 3000);
    } finally {
      setAddingBooks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(book._id);
        return newSet;
      });
    }
  };

  // Fonction pour rechercher par genre
  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    setSearchTerm("");
    // Déclencher la recherche
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (initialLoading) {
    return (
      <div className="bento-container">
        <div className="bento-card">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement des recommandations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bento-container">
      {/* En-tête */}
      <div className="bento-card bento-header">
        <h1 className="bento-title">Découvrir</h1>
        <p className="bento-subtitle">
          Explorez de nouveaux livres et trouvez votre prochaine lecture
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="bento-card">
        <div className="search-form">
          <input
            type="text"
            placeholder="Rechercher un livre, un auteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="genre-select"
          >
            <option value="">Tous les genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            className="search-button"
            disabled={loading}
          >
            {loading ? "Recherche..." : "Rechercher"}
          </button>
        </div>
      </div>

      {/* Genres populaires */}
      <div className="bento-card bento-wide">
        <h2 className="section-title">Genres populaires</h2>
        <div className="genres-grid">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreClick(genre)}
              className={`genre-tag ${selectedGenre === genre ? "active" : ""}`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Résultats de recherche */}
      {recommendations.length > 0 && (
        <div className="bento-card bento-wide">
          <h2 className="section-title">Résultats de recherche</h2>
          <div className="books-grid">
            {recommendations.map((book) => (
              <div key={book._id} className="book-card">
                <div className="book-cover-container">
                  {getCoverUrl(book) ? (
                    <img
                      src={getCoverUrl(book)}
                      alt={`Couverture de ${book.title}`}
                      className="book-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="book-cover no-cover"
                    style={{ display: getCoverUrl(book) ? "none" : "flex" }}
                  >
                    📚
                  </div>
                </div>
                <div className="book-info">
                  <div className="book-header">
                    <h3 className="book-title">{book.title}</h3>
                    <span className="book-rating">★ {book.rating}</span>
                  </div>
                  <p className="book-author">par {book.author}</p>
                  <p className="book-genre">{book.genre}</p>
                  <p className="book-description">{book.description}</p>
                  <div className="book-meta">
                    <span className="book-pages">{book.pages} pages</span>
                  </div>
                  <button
                    onClick={() => handleAddToLibrary(book)}
                    className="add-button"
                    disabled={addingBooks.has(book._id)}
                  >
                    {addingBooks.has(book._id)
                      ? "Ajout..."
                      : "Ajouter à ma bibliothèque"}
                  </button>
                  <button
                    onClick={() => handleAddToFavorites(book)}
                    className="favorite-button"
                    disabled={addingBooks.has(book._id)}
                  >
                    {addingBooks.has(book._id)
                      ? "Ajout..."
                      : "Ajouter aux favoris"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommandations par défaut */}
      {recommendations.length === 0 && !loading && (
        <div className="bento-card bento-wide">
          <h2 className="section-title">Recommandations populaires</h2>
          <div className="books-grid">
            {defaultRecommendations.map((book) => (
              <div key={book._id} className="book-card">
                <div className="book-cover-container">
                  {getCoverUrl(book) ? (
                    <img
                      src={getCoverUrl(book)}
                      alt={`Couverture de ${book.title}`}
                      className="book-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="book-cover no-cover"
                    style={{ display: getCoverUrl(book) ? "none" : "flex" }}
                  >
                    📚
                  </div>
                </div>
                <div className="book-info">
                  <div className="book-header">
                    <h3 className="book-title">{book.title}</h3>
                    <span className="book-rating">★ {book.rating}</span>
                  </div>
                  <p className="book-author">par {book.author}</p>
                  <p className="book-genre">{book.genre}</p>
                  <p className="book-description">{book.description}</p>
                  <div className="book-meta">
                    <span className="book-pages">{book.pages} pages</span>
                  </div>
                  <button
                    onClick={() => handleAddToLibrary(book)}
                    className="add-button"
                    disabled={addingBooks.has(book._id)}
                  >
                    {addingBooks.has(book._id)
                      ? "Ajout..."
                      : "Ajouter à ma bibliothèque"}
                  </button>
                  <button
                    onClick={() => handleAddToFavorites(book)}
                    className="favorite-button"
                    disabled={addingBooks.has(book._id)}
                  >
                    {addingBooks.has(book._id)
                      ? "Ajout..."
                      : "Ajouter aux favoris"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* État de chargement */}
      {loading && (
        <div className="bento-card">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Recherche en cours...</p>
          </div>
        </div>
      )}

      {/* Aucun résultat */}
      {recommendations.length === 0 &&
        !loading &&
        (searchTerm || selectedGenre) && (
          <div className="bento-card bento-empty">
            <h3>Aucun livre trouvé</h3>
            <p>
              Essayez avec d'autres termes de recherche ou explorez nos genres
              populaires.
            </p>
          </div>
        )}
    </div>
  );
};

export default Discover;
