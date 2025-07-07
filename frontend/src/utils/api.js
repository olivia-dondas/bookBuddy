import axios from "axios";

// Configuration de base d'Axios
const API_BASE_URL = "http://localhost:5055";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter automatiquement le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fonctions API pour l'authentification
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (userData) => api.post("/auth/login", userData),
};

// Fonctions API pour les livres
export const booksAPI = {
  getAll: () => api.get("/books"),
  getById: (id) => api.get(`/books/${id}`),
  create: (bookData) => api.post("/books", bookData),
  update: (id, bookData) => api.put(`/books/${id}`, bookData),
  delete: (id) => api.delete(`/books/${id}`),
  updateProgress: (id, progressData) =>
    api.put(`/books/${id}/progress`, progressData),

  // Nouvelles fonctionnalités
  toggleFavorite: (id) => api.put(`/books/${id}/favorite`),
  addRating: (id, ratingData) => api.put(`/books/${id}/rating`, ratingData),
  addNotes: (id, notesData) => api.put(`/books/${id}/notes`, notesData),
  getFavorites: () => api.get("/books/favorites"),
  addToFavorites: (bookData) => api.post("/books/favorites", bookData),

  filter: (params) => api.get("/books/filter", { params }),
};

// Fonctions API pour les récompenses
export const rewardsAPI = {
  getAll: () => api.get("/rewards"),
  give: (type, rewardData) => api.post(`/rewards/${type}`, rewardData),
};

// Fonctions API pour les recommandations
export const recommendationsAPI = {
  getAll: (params = {}) => api.get("/recommendations", { params }),
  getGenres: () => api.get("/recommendations/genres"),
  getById: (id) => api.get(`/recommendations/${id}`),
  create: (bookData) => api.post("/recommendations", bookData),
};

// Fonctions API pour les utilisateurs
export const usersAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (id, userData) => api.put(`/users/${id}`, userData),
};

export default api;
