import React, { useState } from "react";
import { booksAPI } from "../utils/api";
import imageManager from "../utils/imageManager";
import bookEventManager, { EVENTS } from "../utils/bookEventManager";
import "./BookComponent.css";

const BookComponent = ({
  book,
  onDelete,
  onUpdate,
  onEdit,
  onToggleFavorite,
  showProgress = false,
  showRating = false,
}) => {
  const [loading, setLoading] = useState(false);

  // Fonction pour déterminer l'URL de la couverture
  const getCoverUrl = () => {
    // Utiliser imageManager pour une gestion centralisée des images
    return imageManager.getImageUrl(book.cover_url || book.cover);
  };

  const handleDelete = async () => {
    if (
      window.confirm(`Êtes-vous sûr de vouloir supprimer "${book.title}" ?`)
    ) {
      setLoading(true);
      try {
        await booksAPI.delete(book._id);
        onDelete(book._id);
        
        // Émettre un événement pour notifier les autres pages
        bookEventManager.emit(EVENTS.BOOK_DELETED, book._id);
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
      
      // Émettre un événement pour notifier les autres pages
      bookEventManager.emit(EVENTS.BOOK_UPDATED, response.data);
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

        {book.category && <p className="book-category">{book.category}</p>}

        {book.pages && <p className="book-pages">{book.pages} pages</p>}

        {showProgress && book.currentPage && book.pages && (
          <div className="book-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(book.currentPage / book.pages) * 100}%` }}
              ></div>
            </div>
            <p className="progress-text">
              {book.currentPage} / {book.pages} pages (
              {Math.round((book.currentPage / book.pages) * 100)}%)
            </p>
          </div>
        )}

        {book.rating && (
          <div className="book-rating">
            <span className="rating-stars">
              {"★".repeat(book.rating)}
              {"☆".repeat(5 - book.rating)}
            </span>
            <span className="rating-text">({book.rating}/5)</span>
          </div>
        )}

        {book.comment && <p className="book-comment">💬 {book.comment}</p>}

        {book.notes && <p className="book-notes">📝 {book.notes}</p>}

        <div className={`book-status ${getStatusClass(book.status)}`}>
          <span>{getStatusIcon(book.status)}</span>
          <span>{getStatusLabel(book.status)}</span>
        </div>
      </div>

      <div className="book-actions">
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(book._id)}
            className={`favorite-btn ${book.is_favorite ? "active" : ""}`}
            disabled={loading}
          >
            {book.is_favorite ? "❤️" : "🤍"} Favoris
          </button>
        )}

        {onEdit && (
          <button
            onClick={() => onEdit(book)}
            disabled={loading}
            className="edit-btn"
          >
            ✏️ Modifier
          </button>
        )}

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
