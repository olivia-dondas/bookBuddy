import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BookComponent from "../components/BookComponent";
import AddBookForm from "../components/AddBookForm";
import { booksAPI } from "../utils/api";
import bookEventManager, { EVENTS } from "../utils/bookEventManager";
import "./Home.css";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Rediriger vers login si non connecté
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Charger les livres au montage du composant
  useEffect(() => {
    if (user && !authLoading) {
      fetchBooks();
    }
  }, [user, authLoading]);

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
      setError(
        "Impossible de charger les livres. Assurez-vous d'être connecté."
      );
    } finally {
      setLoading(false);
    }
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

  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Vérification de l'authentification...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Éviter le flash avant redirection
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement de vos livres...</p>
      </div>
    );
  }

  return (
    <div className="bento-container">
      {/* En-tête */}
      <div className="bento-card bento-header">
        <h1 className="bento-title">Bonjour {user?.name || "Utilisateur"}</h1>
        <p className="bento-subtitle">
          Bienvenue dans votre bibliothèque personnelle
        </p>
      </div>

      {/* Statistiques - Grille bento */}
      <div className="bento-grid">
        <div className="bento-card bento-stat">
          <div className="stat-value">{books.length}</div>
          <div className="stat-label">Livres dans votre bibliothèque</div>
        </div>
        <div className="bento-card bento-stat">
          <div className="stat-value">
            {books.filter((book) => book.status === "terminé").length}
          </div>
          <div className="stat-label">Livres terminés</div>
        </div>
        <div className="bento-card bento-stat">
          <div className="stat-value">
            {books.filter((book) => book.status === "en cours").length}
          </div>
          <div className="stat-label">Lectures en cours</div>
        </div>
        <div className="bento-card bento-stat">
          <div className="stat-value">Niveau {user?.level || 1}</div>
          <div className="stat-label">Votre niveau</div>
        </div>
      </div>

      {/* Actions */}
      <div className="bento-card bento-actions">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="primary-button"
        >
          {showAddForm ? "Annuler" : "Ajouter un livre"}
        </button>
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
      {books.length === 0 && !loading && !error ? (
        <div className="bento-card bento-empty">
          <h3>Votre bibliothèque est vide</h3>
          <p>
            Ajoutez votre premier livre pour commencer votre aventure littéraire
            !
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="primary-button"
          >
            Ajouter mon premier livre
          </button>
        </div>
      ) : (
        <div className="bento-card bento-wide">
          <h2 className="section-title">Vos livres</h2>
          <div className="books-grid">
            {books.map((book) => (
              <BookComponent
                key={book._id}
                book={book}
                onDelete={handleBookDeleted}
                onUpdate={handleBookUpdated}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
