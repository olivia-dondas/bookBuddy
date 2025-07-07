const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques (images uploadées)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.error("Erreur MongoDB :", err));

// Exemple de route test
app.get("/", (req, res) => {
  res.send("BookBuddy API fonctionne !");
});

// Importation des routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const bookRoutes = require("./routes/bookRoutes");
app.use("/books", bookRoutes);

const recommendationRoutes = require("./routes/recommendationRoutes");
app.use("/recommendations", recommendationRoutes);

const rewardRoutes = require("./routes/rewardRoutes");
app.use("/rewards", rewardRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
