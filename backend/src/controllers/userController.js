const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Récupérer le profil (hors mot de passe)
exports.getProfile = async (req, res) => {
  try {
    if (req.user.userId !== req.params.id) {
      return res.status(403).json({ message: "Accès refusé." });
    }
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Modifier le profil (username, email, mot de passe)
exports.updateProfile = async (req, res) => {
  try {
    if (req.user.userId !== req.params.id) {
      return res.status(403).json({ message: "Accès refusé." });
    }
    const update = { ...req.body };
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      select: "-password",
    });
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du profil." });
  }
};
