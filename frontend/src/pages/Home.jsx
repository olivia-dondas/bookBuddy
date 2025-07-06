import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BookComponent from "../components/BookComponent";
import AddBookForm from "../components/AddBookForm";
import { booksAPI } from "../utils/api";
import "./Home.css";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  // Rediriger vers login si non connecté
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Charger les livres au montage du composant
  useEffect(() => {
    if (user) {
      fetchBooks();
    }
  }, [user]);

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
    <div className="home-page">
      <div className="page-header">
        <h1 className="page-title">Bonjour {user?.name || "Utilisateur"}</h1>
        <p className="page-subtitle">
          Bienvenue dans votre bibliothèque personnelle
        </p>
      </div>

      {/* Statistiques - Toujours affichées */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{books.length}</div>
          <div className="stat-label">Livres dans votre bibliothèque</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {books.filter((book) => book.status === "terminé").length}
          </div>
          <div className="stat-label">Livres terminés</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {books.filter((book) => book.status === "en cours").length}
          </div>
          <div className="stat-label">Lectures en cours</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">Niveau {user?.level || 1}</div>
          <div className="stat-label">Votre niveau</div>
        </div>
      </div>

      {/* Actions - Toujours affichées */}
      <div className="actions-bar">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="primary-button"
        >
          {showAddForm ? "Annuler" : "Ajouter un livre"}
        </button>
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
      {books.length === 0 && !loading && !error ? (
        <div className="empty-state">
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
        <div className="books-section">
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
