// Utilitaire pour gérer les images côté frontend
class ImageManager {
  constructor(baseUrl = null) {
    this.baseUrl = baseUrl || this.getBaseURL();
  }

  // Déterminer l'URL de base selon l'environnement
  getBaseURL() {
    if (process.env.NODE_ENV === "production") {
      return "https://bookbuddy-backend.herokuapp.com";
    }
    return "http://localhost:5055";
  }

  // Construire l'URL complète d'une image
  getImageUrl(filename) {
    if (!filename) return this.getPlaceholderUrl();

    // Si c'est déjà une URL complète, la retourner
    if (filename.startsWith("http")) {
      return filename;
    }

    return `${this.baseUrl}/uploads/covers/${filename}`;
  }

  // Image par défaut pour les livres sans couverture
  getPlaceholderUrl() {
    return `${this.baseUrl}/uploads/covers/placeholder.jpg`;
  }

  // Uploader une image
  async uploadImage(file, bookId) {
    const formData = new FormData();
    formData.append("cover", file);
    formData.append("bookId", bookId);

    try {
      const response = await fetch(`${this.baseUrl}/books/upload-cover`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'upload");
      }

      const data = await response.json();
      return data.coverUrl;
    } catch (error) {
      console.error("Erreur upload image:", error);
      throw error;
    }
  }

  // Supprimer une image
  async deleteImage(filename) {
    try {
      const response = await fetch(`${this.baseUrl}/books/delete-cover`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      return true;
    } catch (error) {
      console.error("Erreur suppression image:", error);
      throw error;
    }
  }

  // Valider une image avant upload
  validateImage(file) {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Format d'image non supporté. Utilisez JPEG, PNG, GIF ou WebP."
      );
    }

    if (file.size > maxSize) {
      throw new Error("L'image est trop volumineuse. Taille maximale: 5MB.");
    }

    return true;
  }

  // Prévisualiser une image avant upload
  previewImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  // Optimiser les images pour le web
  optimizeImageUrl(url, width = 300, height = 400) {
    // Pour une future intégration avec un service d'optimisation d'images
    // comme Cloudinary, ImageKit, etc.
    return url;
  }
}

// Instance par défaut
const imageManager = new ImageManager();

export default imageManager;
