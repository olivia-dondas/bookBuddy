const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Référence aux livres favoris
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],

  // Champs pour la gamification
  level: { type: Number, default: 1 },
  booksReadCount: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", userSchema);
