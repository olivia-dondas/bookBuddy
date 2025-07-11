# 📚 BookBuddy

<p align="center"><em>« Un livre, c'est comme une clé qui ouvre la porte à un monde imaginaire où les rêves prennent vie. »<br>— Kirsten Dunst dans <strong>Virgin Suicides</strong></em></p>

---

## ✨ Présentation

**BookBuddy** est une application web moderne conçue pour accompagner les passionnés de lecture dans la gestion de leur bibliothèque personnelle.

Développée avec **ReactJS**, **ExpressJS** et **MongoDB**, elle permet d'explorer, organiser et suivre ses lectures en toute simplicité. Grâce à une interface fluide et intuitive, chaque utilisateur peut enrichir son expérience littéraire avec des fonctionnalités avancées : **recherche dynamique**, **système de favoris**, **progression de lecture** et **gamification**.

---

## 🚀 Fonctionnalités

### ✨ **Fonctionnalités Principales**

✅ **Gestion de Bibliothèque**

- Ajouter des livres (titre, auteur, couverture, état, pages, catégorie)
- Validation en temps réel des formulaires
- Affichage en **grille moderne** avec design bento
- **Recherche dynamique** et **filtres intelligents** (titre, auteur, genre, statut)
- Modification complète des livres avec modal d'édition

✅ **Suivi de Lecture**

- Composants individuels pour chaque livre (BookComponent)
- Suivi de lecture avec **barre de progression dynamique**
- Statuts : À lire, En cours, Terminé
- Mise à jour de la dernière page lue

✅ **Système de Favoris**

- Marquer/démarquer des livres comme favoris
- Page dédiée aux favoris avec API backend
- Boutons favoris dans Découvrir et Bibliothèque

✅ **Système de Notes et Avis**

- Ratings 1-5 étoiles sur chaque livre
- Commentaires personnels
- Notes détaillées pour annotations
- Affichage visuel des évaluations

✅ **Page Découvrir**

- Recommandations depuis base de données MongoDB
- 20+ livres populaires pré-chargés
- Filtrage par genres dynamiques
- Ajout direct à la bibliothèque ou aux favoris

✅ **Gamification**

- **Badges et récompenses** automatiques
- Système de niveaux basé sur les livres lus
- Objectifs (ex: 5 livres = badge)
- Page dédiée aux succès

✅ **Authentification Sécurisée**

- Inscription avec validation
- Connexion JWT sécurisée
- Gestion de profil utilisateur
- Modification mot de passe
- Accès protégé à toutes les fonctionnalités

---

## 🛠️ Stack technique

**Frontend**

- ReactJS (Vite) - Framework interface utilisateur
- CSS Modules - Styles composants modulaires
- Système de design moderne (inspiré Mucem)
- Interface responsive et accessible

**Backend**

- Node.js + ExpressJS - Serveur et API REST
- JWT pour l'authentification sécurisée
- Architecture MVC (Modèle-Vue-Contrôleur)
- Middleware de protection des routes

**Base de données**

- MongoDB avec Mongoose - Base NoSQL
- Collections : Users, Books, RecommendedBooks, Rewards
- Schémas de validation robustes

**Outils de développement**

- Git/GitHub pour versioning
- Nodemon pour développement backend
- Vite HMR pour développement frontend

---

## 📦 Installation

### 🔧 Prérequis

- Node.js ≥ 18
- MongoDB (local ou Atlas)
- npm

### 🧱 Étapes

```bash
# 1. Cloner le projet
git clone https://github.com/olivia-dondas/bookBuddy.git
cd bookBuddy

# 2. Installer les dépendances
cd backend
npm install

cd ../frontend
npm install
```

### ▶️ Lancement

```bash
# Backend (Port 5055)
cd backend
npm run dev
# ou npm start

# Frontend (Port 5173 ou suivant disponible)
cd ../frontend
npm run dev
```

**Accès à l'application :**

- Frontend : http://localhost:5173
- Backend API : http://localhost:5055

### 🔧 Configuration

1. **Créer un fichier `.env` dans le dossier `backend`** :

```bash
# Backend/.env
PORT=5055
MONGODB_URI=mongodb://localhost:27017/bookbuddy
JWT_SECRET=votre_jwt_secret_super_securise
```

2. **Démarrer MongoDB** :

```bash
# Option 1: MongoDB local
mongod

# Option 2: MongoDB avec Docker
docker run -d -p 27017:27017 --name mongodb mongo

# Option 3: Utiliser MongoDB Atlas (cloud)
# Remplacer MONGODB_URI par votre chaîne de connexion Atlas
```

3. **Peuplement de la base de données** (optionnel) :

Les livres de démonstration sont maintenant ajoutés directement via MongoDB Compass ou le shell MongoDB. Consultez la section "Données de démonstration" plus bas pour les détails.

---

## 🧭 Architecture

```
bookBuddy/
├── backend/
│   ├── src/
│   │   ├── controllers/    → Logique métier (auth, books, recommendations, rewards)
│   │   ├── models/         → Modèles MongoDB (User, Book, RecommendedBook, Reward)
│   │   ├── routes/         → Définition des endpoints API
│   │   ├── middleware/     → Authentification JWT
│   │   └── app.js          → Point d'entrée serveur Express
│   ├── uploads/            → Stockage fichiers (covers)
│   ├── package.json
│   └── .env               → Variables d'environnement
├── frontend/
│   ├── src/
│   │   ├── components/     → Composants réutilisables (BookComponent, Modals)
│   │   ├── pages/          → Pages principales (Home, Books, Discover, etc.)
│   │   ├── context/        → Gestion état global (AuthContext)
│   │   ├── utils/          → Services API et utilitaires
│   │   └── main.jsx        → Point d'entrée React
│   ├── public/
│   │   └── images/         → Assets statiques (covers)
│   ├── package.json
│   └── vite.config.js
├── docs/                   → Documentation (maquettes, BDD)
└── README.md

**Structure des Données :**

📊 User → 📚 Books (1:N)
📚 Books ↔ ⭐ Favoris (N:M via is_favorite)
👤 User → 🏆 Rewards (1:N)
📖 RecommendedBooks (Collection séparée pour découverte)
```

---

## 🏅 Gamification

BookBuddy transforme la lecture en jeu :

- Badges à débloquer (nombre de livres lus, catégories terminées, etc.)
- Page dédiée aux succès
- Objectifs personnalisés

---

## 🎓 Objectifs pédagogiques

Ce projet a pour but de :

- Comprendre et mettre en place un environnement **MERN**
- Développer une **interface réactive et moderne**
- Concevoir une base de données **NoSQL efficace**
- Structurer un projet fullstack de manière **professionnelle**
- Implémenter une **authentification sécurisée** avec gestion de session

---

## 📋 Cahier des charges (extrait)

Fonctionnalités clés à implémenter :

- Formulaire d'ajout de livres (titre, auteur, couverture, pages, catégorie, état)
- Affichage de la collection avec filtres et recherche
- Modale de détails pour chaque livre
- Suivi de lecture et barre de progression
- Favoris et système de badges
- Authentification sécurisée
- API RESTful :

```http
# Books
POST   /books
GET    /books
GET    /books/:id
GET    /books/filter
PUT    /books/:id
PUT    /books/:id/progress
POST   /books/:id/favorite
DELETE /books/:id/favorite

# Rewards
POST   /rewards/:type

# Auth
POST   /auth/register
POST   /auth/login

# Users
GET    /users/:id
PUT    /users/:id
```

---

## 📱 Pages et Fonctionnalités

### 🏠 **Accueil (Home)**

- Dashboard utilisateur avec statistiques
- Aperçu des livres en cours
- Progression globale de lecture

### 📚 **Ma Bibliothèque (Books)**

- Vue grille moderne avec système bento
- Recherche et filtres avancés (titre, auteur, genre, statut)
- Boutons d'action : Modifier, Favoris, Changer statut
- Modal d'édition complète pour chaque livre

### 🔍 **Découvrir (Discover)**

- Recommandations populaires depuis MongoDB
- Filtrage par genres dynamiques
- Boutons : "Ajouter à ma bibliothèque" et "Ajouter aux favoris"
- Interface de recherche avancée

### 📖 **En Cours de Lecture (Reading)**

- Livres actuellement en cours
- Barre de progression pour chaque livre
- Mise à jour rapide de la dernière page lue

### ❤️ **Favoris (Favorites)**

- Collection des livres marqués comme favoris
- Gestion complète (édition, suppression, retrait favoris)
- Interface cohérente avec la bibliothèque

### 📊 **Statistiques (Statistics)**

- Graphiques de progression de lecture
- Statistiques par genre, par mois, etc.
- Visualisation des objectifs atteints

### 👤 **Profil (Profile)**

- Informations utilisateur
- Modification mot de passe
- Badges et récompenses obtenus
- Niveau de progression

---

## 🔗 API Endpoints

### 🔐 **Authentification**

```http
POST /auth/register     # Inscription
POST /auth/login        # Connexion
```

### 📚 **Livres**

```http
GET    /books           # Récupérer tous les livres
POST   /books           # Créer un nouveau livre
GET    /books/:id       # Récupérer un livre par ID
PUT    /books/:id       # Mettre à jour un livre
DELETE /books/:id       # Supprimer un livre
PUT    /books/:id/progress  # Mettre à jour la progression
POST   /books/:id/favorite  # Ajouter aux favoris
DELETE /books/:id/favorite  # Retirer des favoris
```

### 🎯 **Recommandations**

```http
GET    /recommendations      # Récupérer les recommandations
GET    /recommendations/genres  # Récupérer les genres
```

### 👤 **Utilisateurs**

```http
GET    /users/:id       # Récupérer profil utilisateur
PUT    /users/:id       # Mettre à jour profil
```

### 🏆 **Récompenses**

```http
GET    /rewards         # Récupérer les récompenses
POST   /rewards/:type   # Créer une récompense
```

---

## 🎨 Design et UX

### Palette de couleurs

- **Primaire** : #2C3E50 (Bleu foncé)
- **Secondaire** : #E74C3C (Rouge)
- **Accent** : #F39C12 (Orange)
- **Succès** : #27AE60 (Vert)
- **Fond** : #ECF0F1 (Gris clair)

### Inspirations design

- **Mucem** : Minimalisme et élégance
- **Bento Grid** : Disposition moderne en grille
- **Material Design** : Composants cohérents

---

## 💌 À propos

Projet réalisé dans le cadre de [**La Plateforme**](https://laplateforme.io), grande école du numérique à Marseille.

📫 Contact : [olivia-dondas@laplateforme.io](mailto:olivia-dondas@laplateforme.io)

---

## 🔗 Ressources utiles

- [ReactJS](https://react.dev/)
- [ViteJS](https://vitejs.dev/)
- [ExpressJS](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/docs/)
- [Mongoose](https://mongoosejs.com/)

---

<p align="center"><strong>📚 Bonne lecture et bon code avec BookBuddy !</strong></p>
