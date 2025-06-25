const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
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
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Book", bookSchema);
