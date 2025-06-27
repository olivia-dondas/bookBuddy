## 📚 Routes Livres (`/books`)
- **POST** `/books` : Ajouter un livre
- **GET** `/books` : Lister les livres de l’utilisateur
- **GET** `/books/:id` : Détail d’un livre
- **PUT** `/books/:id` : Modifier un livre
- **DELETE** `/books/:id` : Supprimer un livre
- **PUT** `/books/:id/progress` : Mettre à jour la progression de lecture
- **POST** `/books/:id/favorite` : Ajouter un livre aux favoris
- **DELETE** `/books/:id/favorite` : Retirer un livre des favoris
- **GET** `/books/filter` : Recherche/filtres dynamiques

---

## 🏅 Routes Récompenses (`/rewards`)
- **POST** `/rewards/:type` : Déclencher une action de gamification (attribuer un badge)
- **GET** `/rewards` : Lister les récompenses de l’utilisateur

---

## 👤 Routes Utilisateur (`/auth`, `/users`)
- **POST** `/auth/register` : Inscription
- **POST** `/auth/login` : Connexion
- **GET** `/users/:id` : Récupérer le profil utilisateur
- **PUT** `/users/:id` : Modifier le profil utilisateur