# 📚 API – Listing des routes

Ce document recense l'ensemble des routes disponibles dans l'application **BookBuddy**, organisées par domaine fonctionnel.  
Chaque route est accompagnée d'une description claire pour faciliter son utilisation.

---

## 🔖 Livres (`/books`)

| Méthode | Endpoint              | Description                                  | Auth requise |
| ------- | --------------------- | -------------------------------------------- | ------------ |
| POST    | `/books`              | Ajouter un livre à la collection             | ✅           |
| GET     | `/books`              | Lister les livres de l’utilisateur           | ✅           |
| GET     | `/books/:id`          | Obtenir les détails d’un livre               | ✅           |
| PUT     | `/books/:id`          | Modifier les informations d’un livre         | ✅           |
| DELETE  | `/books/:id`          | Supprimer un livre de la collection          | ✅           |
| PUT     | `/books/:id/progress` | Mettre à jour la progression de lecture      | ✅           |
| POST    | `/books/:id/favorite` | Ajouter un livre aux favoris                 | ✅           |
| DELETE  | `/books/:id/favorite` | Retirer un livre des favoris                 | ✅           |
| GET     | `/books/filter`       | Rechercher des livres via filtres dynamiques | ✅           |

---

## 🏅 Récompenses (`/rewards`)

| Méthode | Endpoint         | Description                                   | Auth requise |
| ------- | ---------------- | --------------------------------------------- | ------------ |
| POST    | `/rewards/:type` | Déclencher une action de gamification (badge) | ✅           |
| GET     | `/rewards`       | Lister les récompenses de l’utilisateur       | ✅           |

---

## 👤 Utilisateur (`/auth`, `/users`)

| Méthode | Endpoint         | Description                       | Auth requise |
| ------- | ---------------- | --------------------------------- | ------------ |
| POST    | `/auth/register` | Créer un nouveau compte           | ❌           |
| POST    | `/auth/login`    | Se connecter                      | ❌           |
| GET     | `/users/:id`     | Récupérer les informations profil | ✅           |
| PUT     | `/users/:id`     | Modifier le profil utilisateur    | ✅           |

---

## 🔐 Légende

- ✅ : Authentification requise (JWT)
- ❌ : Accessible sans authentification

---

## ✨ À venir (routes potentielles)

- [ ] `/books/:id/review` – Ajouter une note ou un commentaire à un livre
- [ ] `/notifications` – Gérer les rappels de lecture
- [ ] `/stats` – Afficher des statistiques de lecture

---

📁 _Fichier maintenu par [Olivia Dondas](mailto:olivia-dondas@laplateforme.io) dans le cadre du projet BookBuddy._
