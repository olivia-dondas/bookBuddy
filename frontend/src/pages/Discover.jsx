import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Discover.css";

const Discover = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  // Genres populaires
  const genres = [
    "Roman",
    "Science-fiction",
    "Fantasy",
    "Policier",
    "Thriller",
    "Biographie",
    "Histoire",
    "Philosophie",
    "Développement personnel",
    "Poésie",
    "Essai",
    "Aventure",
  ];

  // Recommandations populaires (données fictives)
  const popularBooks = [
    {
      id: 1,
      title: "L'Étranger",
      author: "Albert Camus",
      genre: "Roman",
      description: "Un classique de la littérature française",
      rating: 4.2,
      pages: 123,
    },
    {
      id: 2,
      title: "Dune",
      author: "Frank Herbert",
      genre: "Science-fiction",
      description: "Une épopée spatiale inoubliable",
      rating: 4.5,
      pages: 688,
    },
    {
      id: 3,
      title: "Le Seigneur des Anneaux",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      description: "La trilogie fantasy par excellence",
      rating: 4.8,
      pages: 1216,
    },
    {
      id: 4,
      title: "1984",
      author: "George Orwell",
      genre: "Roman",
      description: "Un roman dystopique visionnaire",
      rating: 4.6,
      pages: 328,
    },
    {
      id: 5,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      genre: "Essai",
      description: "Une brève histoire de l'humanité",
      rating: 4.4,
      pages: 512,
    },
    {
      id: 6,
      title: "L'Alchimiste",
      author: "Paulo Coelho",
      genre: "Développement personnel",
      description: "Une fable philosophique inspirante",
      rating: 4.3,
      pages: 163,
    },
  ];

  const handleSearch = () => {
    setLoading(true);

    // Simulation d'une recherche
    setTimeout(() => {
      let filtered = popularBooks;

      if (searchTerm) {
        filtered = filtered.filter(
          (book) =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedGenre) {
        filtered = filtered.filter((book) => book.genre === selectedGenre);
      }

      setRecommendations(filtered);
      setLoading(false);
    }, 1000);
  };

  const handleAddToLibrary = (book) => {
    // Simulation d'ajout à la bibliothèque
    alert(`"${book.title}" a été ajouté à votre liste de souhaits !`);
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="discover-page">
      <div className="page-header">
        <h1 className="page-title">Découvrir</h1>
        <p className="page-subtitle">
          Explorez de nouveaux livres et trouvez votre prochaine lecture
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="search-section">
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
      <div className="genres-section">
        <h2 className="section-title">Genres populaires</h2>
        <div className="genres-grid">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => {
                setSelectedGenre(genre);
                setSearchTerm("");
                handleSearch();
              }}
              className={`genre-tag ${selectedGenre === genre ? "active" : ""}`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Résultats de recherche */}
      {recommendations.length > 0 && (
        <div className="results-section">
          <h2 className="section-title">Résultats de recherche</h2>
          <div className="books-grid">
            {recommendations.map((book) => (
              <div key={book.id} className="book-card">
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
                >
                  Ajouter à ma bibliothèque
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommandations par défaut */}
      {recommendations.length === 0 && !loading && (
        <div className="default-recommendations">
          <h2 className="section-title">Recommandations populaires</h2>
          <div className="books-grid">
            {popularBooks.slice(0, 4).map((book) => (
              <div key={book.id} className="book-card">
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
                >
                  Ajouter à ma bibliothèque
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* État de chargement */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Recherche en cours...</p>
        </div>
      )}

      {/* Aucun résultat */}
      {recommendations.length === 0 &&
        !loading &&
        (searchTerm || selectedGenre) && (
          <div className="no-results">
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
