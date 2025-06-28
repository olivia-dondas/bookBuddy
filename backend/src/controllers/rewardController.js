const Reward = require("../models/Reward");

exports.giveReward = async (req, res) => {
  try {
    const { type } = req.params;
    const { label } = req.body;
    const reward = new Reward({
      user_id: req.user.userId,
      type,
      label,
    });
    await reward.save();
    res.status(201).json({ message: "Récompense attribuée.", reward });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'attribution de la récompense." });
  }
};

// Lister toutes les récompenses de l'utilisateur
exports.getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({ user_id: req.user.userId });
    res.json(rewards);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des récompenses." });
  }
};
