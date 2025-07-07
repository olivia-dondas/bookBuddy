const mongoose = require("mongoose");

const recommendedBookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    cover_url: { type: String },
    genre: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    pages: { type: Number, required: true },
    isbn: { type: String },
    published_year: { type: Number },
    language: { type: String, default: "fr" },
    is_featured: { type: Boolean, default: false }, // Pour les recommandations mises en avant
    is_active: { type: Boolean, default: true }, // Pour activer/désactiver les recommandations
  },
  {
    timestamps: true,
  }
);

// Index pour améliorer les performances de recherche
recommendedBookSchema.index({
  title: "text",
  author: "text",
  description: "text",
});
recommendedBookSchema.index({ genre: 1 });
recommendedBookSchema.index({ is_featured: 1 });
recommendedBookSchema.index({ is_active: 1 });

module.exports = mongoose.model("RecommendedBook", recommendedBookSchema);
