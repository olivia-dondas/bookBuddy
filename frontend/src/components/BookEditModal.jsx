import React, { useState, useEffect } from "react";
import { booksAPI } from "../utils/api";
import "./BookEditModal.css";

const BookEditModal = ({ book, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    cover_url: "",
    category: "",
    pages: "",
    status: "à lire",
    rating: "",
    comment: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        cover_url: book.cover_url || "",
        category: book.category || "",
        pages: book.pages || "",
        status: book.status || "à lire",
        rating: book.rating || "",
        comment: book.comment || "",
        notes: book.notes || "",
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedBook = await booksAPI.update(book._id, formData);
      onSave(updatedBook.data);
      onClose();

      // Notification de succès
      const notification = document.createElement("div");
      notification.className = "success-notification";
      notification.textContent = "Livre modifié avec succès !";
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
      setTimeout(() => notification.remove(), 3000);
    } catch (error) {
      console.error("Erreur lors de la modification:", error);

      // Notification d'erreur
      const notification = document.createElement("div");
      notification.className = "error-notification";
      notification.textContent = "Erreur lors de la modification";
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
      setTimeout(() => notification.remove(), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Modifier le livre</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="title">Titre *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Auteur *</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cover_url">URL de la couverture</label>
            <input
              type="url"
              id="cover_url"
              name="cover_url"
              value={formData.cover_url}
              onChange={handleChange}
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Catégorie</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Roman, Science-fiction, etc."
              />
            </div>

            <div className="form-group">
              <label htmlFor="pages">Nombre de pages</label>
              <input
                type="number"
                id="pages"
                name="pages"
                value={formData.pages}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Statut</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="à lire">À lire</option>
              <option value="en cours">En cours</option>
              <option value="terminé">Terminé</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="rating">Note (1-5)</label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            >
              <option value="">Pas de note</option>
              <option value="1">1 ⭐</option>
              <option value="2">2 ⭐</option>
              <option value="3">3 ⭐</option>
              <option value="4">4 ⭐</option>
              <option value="5">5 ⭐</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="comment">Commentaire</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows="3"
              placeholder="Votre avis sur ce livre..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes personnelles</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Vos notes personnelles, citations préférées, etc."
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="save-button">
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookEditModal;
