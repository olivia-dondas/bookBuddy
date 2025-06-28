const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

// Récupérer le profil utilisateur
router.get("/:id", auth, userController.getProfile);

// Modifier le profil utilisateur
router.put("/:id", auth, userController.updateProfile);

module.exports = router;
