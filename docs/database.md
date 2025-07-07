# Schéma de la Base de Données BookBuddy

## Table `users`

Contient les informations sur les utilisateurs, leur authentification et leur progression.

| Champ            | Type         | Contraintes & Notes                           |
| ---------------- | ------------ | --------------------------------------------- |
| `id`             | `ObjectId`   | Clé primaire (pk)                             |
| `username`       | `string`     | Unique, Requis                                |
| `email`          | `string`     | Unique, Requis                                |
| `password`       | `string`     | Requis (hashé)                                |
| `favorites`      | `ObjectId[]` | Tableau de références vers `books.id`         |
| `level`          | `int`        | Requis, Défaut: 1. Niveau de gamification.    |
| `booksReadCount` | `int`        | Requis, Défaut: 0. Nombre de livres terminés. |

---

## Table `books`

Représente les livres ajoutés par les utilisateurs.

| Champ        | Type       | Contraintes & Notes                              |
| ------------ | ---------- | ------------------------------------------------ |
| `id`         | `ObjectId` | Clé primaire (pk)                                |
| `user_id`    | `ObjectId` | Requis, Référence vers `users.id`                |
| `title`      | `string`   | Requis                                           |
| `author`     | `string`   | Requis                                           |
| `cover_url`  | `string`   | Optionnel                                        |
| `status`     | `string`   | 'à lire', 'en cours', 'terminé'                  |
| `pages`      | `int`      | Optionnel, nombre total de pages                 |
| `category`   | `string`   | Optionnel (ex: 'Fiction', 'Science')             |
| `last_page`  | `int`      | Optionnel, dernière page lue pour la progression |
| `created_at` | `datetime` | Géré par Mongoose (`timestamps: true`)           |

---

## Table `rewards`

Stocke les récompenses (badges, succès) débloquées par les utilisateurs.

| Champ     | Type       | Contraintes & Notes                       |
| --------- | ---------- | ----------------------------------------- |
| `id`      | `ObjectId` | Clé primaire (pk)                         |
| `user_id` | `ObjectId` | Requis, Référence vers `users.id`         |
| `type`    | `string`   | 'badge', 'succès', etc.                   |
| `label`   | `string`   | Nom de la récompense (ex: "5 livres lus") |
| `date`    | `datetime` | Géré par                                  |
