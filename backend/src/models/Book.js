const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    // Référence à l'utilisateur qui possède le livre
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },
    author: { type: String, required: true },
    cover_url: { type: String },
    status: {
      type: String,
      enum: ["à lire", "en cours", "terminé"],
      default: "à lire",
    },
    pages: { type: Number },
    category: { type: String },
    last_page: { type: Number, default: 0 },
  },
  {
    // Ajoute automatiquement les champs createdAt et updatedAt
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);
