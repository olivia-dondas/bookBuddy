import axios from "axios";

// Configuration de base d'Axios avec gestion environnement
const getBaseURL = () => {
  if (process.env.NODE_ENV === "production") {
    // URL de votre backend déployé (à modifier selon votre hébergement)
    return "https://bookbuddy-backend.herokuapp.com";
  }
  return "http://localhost:5055";
};

const API_BASE_URL = getBaseURL();

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

// Fonctions de transformation des données
const transformBookFromAPI = (book) => {
  const transformed = {
    ...book,
    currentPage: book.last_page || 0,
  };
  // Debug: vérifier la transformation
  if (book.last_page !== undefined) {
    console.log(`Transformation: ${book.title} - last_page: ${book.last_page} -> currentPage: ${transformed.currentPage}`);
  }
  return transformed;
};

const transformBookToAPI = (book) => {
  const { currentPage, ...rest } = book;
  const transformed = {
    ...rest,
    last_page: currentPage || 0,
  };
  // Debug: vérifier la transformation
  if (currentPage !== undefined) {
    console.log(`Transformation vers API: ${book.title} - currentPage: ${currentPage} -> last_page: ${transformed.last_page}`);
  }
  return transformed;
};

// Fonctions API pour les livres
export const booksAPI = {
  getAll: async () => {
    const response = await api.get("/books");
    return {
      ...response,
      data: response.data.map(transformBookFromAPI),
    };
  },
  getById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return {
      ...response,
      data: transformBookFromAPI(response.data),
    };
  },
  create: (bookData) => api.post("/books", transformBookToAPI(bookData)),
  update: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, transformBookToAPI(bookData));
    return {
      ...response,
      data: transformBookFromAPI(response.data),
    };
  },
  delete: (id) => api.delete(`/books/${id}`),
  updateProgress: (id, progressData) =>
    api.put(`/books/${id}/progress`, transformBookToAPI(progressData)),

  // Nouvelles fonctionnalités
  toggleFavorite: async (id) => {
    const response = await api.put(`/books/${id}/favorite`);
    return {
      ...response,
      data: transformBookFromAPI(response.data),
    };
  },
  addRating: async (id, ratingData) => {
    const response = await api.put(`/books/${id}/rating`, ratingData);
    return {
      ...response,
      data: transformBookFromAPI(response.data),
    };
  },
  addNotes: async (id, notesData) => {
    const response = await api.put(`/books/${id}/notes`, notesData);
    return {
      ...response,
      data: transformBookFromAPI(response.data),
    };
  },
  getFavorites: async () => {
    const response = await api.get("/books/favorites");
    return {
      ...response,
      data: response.data.map(transformBookFromAPI),
    };
  },
  addToFavorites: (bookData) => api.post("/books/favorites", transformBookToAPI(bookData)),

  filter: async (params) => {
    const response = await api.get("/books/filter", { params });
    return {
      ...response,
      data: response.data.map(transformBookFromAPI),
    };
  },
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
