<h1 align="center">📚 BookBuddy</h1>
<p align="center"><em>« Un livre, c'est comme une clé qui ouvre la porte à un monde imaginaire où les rêves prennent vie. »<br>— Kirsten Dunst dans <strong>Virgin Suicides</strong></em></p>

---

## ✨ Présentation

**BookBuddy** est une application web moderne conçue pour accompagner les passionnés de lecture dans la gestion de leur bibliothèque personnelle.

Développée avec **ReactJS**, **ExpressJS** et **MongoDB**, elle permet d’explorer, organiser et suivre ses lectures en toute simplicité. Grâce à une interface fluide et intuitive, chaque utilisateur peut enrichir son expérience littéraire avec des fonctionnalités avancées : **recherche dynamique**, **système de favoris**, **progression de lecture** et **gamification**.

---

## 🚀 Fonctionnalités

✅ Ajouter des livres (titre, auteur, couverture, état, pages, catégorie)  
✅ Validation en temps réel des formulaires  
✅ Affichage en **liste ou grille**  
✅ **Recherche dynamique** et **filtres intelligents**  
✅ Composants individuels pour chaque livre avec modale de détails  
✅ Suivi de lecture avec **barre de progression dynamique**  
✅ Système de **favoris** avec page dédiée  
✅ **Badges et récompenses** pour encourager la lecture  
✅ Authentification sécurisée (inscription, connexion, profil)  
✅ Accès protégé aux fonctionnalités (utilisateurs connectés uniquement)

---

## 🛠️ Stack technique

**Frontend**

- ReactJS (Vite)
- Tailwind CSS / CSS Modules
- Formik / React Hook Form

**Backend**

- Node.js + ExpressJS
- JWT pour l’authentification
- Architecture MVC

**Base de données**

- MongoDB avec Mongoose

**Outils**

- Figma (UI/UX)
- DBML / dbdiagram.io (modélisation BDD)
- Trello (gestion de projet)

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
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

---

## 🧭 Architecture

```
bookBuddy/
├── backend/    → API Express, modèles, routes, contrôleurs
├── frontend/   → React app, composants, pages, services
├── README.md
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

- Formulaire d’ajout de livres (titre, auteur, couverture, pages, catégorie, état)
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
