const express = require("express");
const router = express.Router();
const rewardController = require("../controllers/rewardController");
const auth = require("../middleware/authMiddleware");

// Déclencher une action de gamification (ex : attribuer un badge)
router.post("/:type", auth, rewardController.giveReward);

module.exports = router;
