import React, { useState } from "react";
import { booksAPI } from "../utils/api";
import ImageUpload from "./ImageUpload";
import "./AddBookForm.css";

const AddBookForm = ({ onBookAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    cover_url: "",
    category: "",
    pages: "",
    status: "à lire",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = (imageFile) => {
    setFormData({
      ...formData,
      cover_url: imageFile ? imageFile.name || imageFile : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await booksAPI.create(formData);
      console.log("Livre ajouté:", response.data);

      // Réinitialiser le formulaire
      setFormData({
        title: "",
        author: "",
        cover_url: "",
        category: "",
        pages: "",
        status: "à lire",
      });

      // Informer le parent que le livre a été ajouté
      if (onBookAdded) {
        onBookAdded(response.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur lors de l'ajout du livre"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="add-book-form">
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titre *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-input"
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
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Image de couverture</label>
          <ImageUpload
            onImageUpload={handleImageUpload}
            currentImage={formData.cover_url}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Catégorie</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="ex: Science-Fiction, Romance..."
            className="form-input"
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
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Statut</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
          >
            <option value="à lire">À lire</option>
            <option value="en cours">En cours</option>
            <option value="terminé">Terminé</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Ajout en cours..." : "Ajouter le livre"}
        </button>
      </form>
    </div>
  );
};

export default AddBookForm;
