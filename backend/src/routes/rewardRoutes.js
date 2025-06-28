const express = require("express");
const router = express.Router();
const rewardController = require("../controllers/rewardController");
const auth = require("../middleware/authMiddleware");

// Déclencher une action de gamification (ex : attribuer un badge)
router.post("/:type", auth, rewardController.giveReward);

// Lister toutes les récompenses de l'utilisateur
router.get("/", auth, rewardController.getRewards);

module.exports = router;
