const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    // Référence à l'utilisateur qui reçoit la récompense
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: { type: String, required: true }, // 'badge', 'succès'
    label: { type: String, required: true }, // '5 livres lus'
  },
  {
    // Ajoute automatiquement les champs createdAt et updatedAt (date)
    timestamps: true,
  }
);

module.exports = mongoose.model("Reward", rewardSchema);
