import React, { useState } from "react";
import imageManager from "../utils/imageManager";
import "./ImageUpload.css";

const ImageUpload = ({ onImageUpload, currentImage = null, bookId = null }) => {
  const [preview, setPreview] = useState(currentImage);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Valider le fichier
      imageManager.validateImage(file);

      // Prévisualiser
      const previewUrl = await imageManager.previewImage(file);
      setPreview(previewUrl);

      // Uploader si bookId est fourni
      if (bookId) {
        setIsUploading(true);
        setError(null);

        const uploadedUrl = await imageManager.uploadImage(file, bookId);
        onImageUpload(uploadedUrl);
      } else {
        // Juste pour la prévisualisation (nouveau livre)
        onImageUpload(file);
      }
    } catch (err) {
      setError(err.message);
      setPreview(currentImage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageUpload(null);
  };

  return (
    <div className="image-upload">
      <div className="image-preview-container">
        {preview ? (
          <div className="image-preview">
            <img
              src={preview}
              alt="Aperçu couverture"
              className="preview-image"
            />
            <button
              type="button"
              className="remove-image-btn"
              onClick={handleRemoveImage}
              disabled={isUploading}
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="image-placeholder">
            <div className="placeholder-icon">📚</div>
            <p>Aucune couverture</p>
          </div>
        )}
      </div>

      <div className="upload-controls">
        <label className="upload-button">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            style={{ display: "none" }}
          />
          {isUploading ? "Upload..." : "Choisir une image"}
        </label>

        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="upload-info">
        <small>
          Formats supportés: JPEG, PNG, GIF, WebP
          <br />
          Taille maximale: 5MB
        </small>
      </div>
    </div>
  );
};

export default ImageUpload;
