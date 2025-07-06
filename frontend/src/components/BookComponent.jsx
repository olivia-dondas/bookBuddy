import React, { useState } from "react";
import { booksAPI } from "../utils/api";
import "./BookComponent.css";

const BookComponent = ({ book, onDelete, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  // Fonction pour déterminer l'URL de la couverture
  const getCoverUrl = () => {
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

  const handleDelete = async () => {
    if (
      window.confirm(`Êtes-vous sûr de vouloir supprimer "${book.title}" ?`)
    ) {
      setLoading(true);
      try {
        await booksAPI.delete(book._id);
        onDelete(book._id);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression du livre");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      const response = await booksAPI.update(book._id, { status: newStatus });
      onUpdate(response.data);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour du statut");
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "à lire":
        return "À lire";
      case "en cours":
        return "En cours";
      case "terminé":
        return "Terminé";
      default:
        return "À lire";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "à lire":
        return "•";
      case "en cours":
        return "•";
      case "terminé":
        return "•";
      default:
        return "•";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "à lire":
        return "à-lire";
      case "en cours":
        return "en-cours";
      case "terminé":
        return "terminé";
      default:
        return "à-lire";
    }
  };

  const coverUrl = getCoverUrl();

  return (
    <div className="book-component">
      <div className="book-cover-container">
        {coverUrl ? (
          <img
            src={coverUrl}
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
          style={{ display: coverUrl ? "none" : "flex" }}
        >
          LIVRE
        </div>
      </div>

      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">par {book.author}</p>

        <div className="book-meta">
          {book.category && (
            <div className="book-meta-item">
              <span>🏷️</span>
              <span>{book.category}</span>
            </div>
          )}
          {book.pages && (
            <div className="book-meta-item">
              <span>📄</span>
              <span>{book.pages} pages</span>
            </div>
          )}
          {book.year && (
            <div className="book-meta-item">
              <span>📅</span>
              <span>{book.year}</span>
            </div>
          )}
        </div>

        <div className={`book-status ${getStatusClass(book.status)}`}>
          <span>{getStatusIcon(book.status)}</span>
          <span>{getStatusLabel(book.status)}</span>
        </div>
      </div>

      <div className="book-actions">
        {book.status === "à lire" && (
          <button
            onClick={() => handleStatusChange("en cours")}
            disabled={loading}
            className="primary"
          >
            Commencer
          </button>
        )}
        {book.status === "en cours" && (
          <button
            onClick={() => handleStatusChange("terminé")}
            disabled={loading}
            className="primary"
          >
            ✅ Terminé
          </button>
        )}
        {book.status === "terminé" && (
          <button
            onClick={() => handleStatusChange("à lire")}
            disabled={loading}
          >
            🔄 Relire
          </button>
        )}
        <button onClick={handleDelete} disabled={loading} className="delete">
          🗑️ Supprimer
        </button>
      </div>
    </div>
  );
};

export default BookComponent;
