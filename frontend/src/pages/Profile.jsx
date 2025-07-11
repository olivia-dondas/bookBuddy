import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { booksAPI } from "../utils/api";
import bookEventManager, { EVENTS } from "../utils/bookEventManager";
import "./Profile.css";

const Profile = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    favoriteGenre: "",
    readingGoal: "",
  });

  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/login");
      } else {
        setProfileData({
          name: user.name || user.username || "",
          email: user.email || "",
          bio: user.bio || "",
          favoriteGenre: user.favoriteGenre || "",
          readingGoal: user.readingGoal || "12",
        });
        fetchUserBooks();
      }
    }
  }, [user, authLoading, navigate]);

  // Écouter les événements de mise à jour des livres
  useEffect(() => {
    const unsubscribe = bookEventManager.subscribe(
      EVENTS.BOOK_UPDATED,
      (updatedBook) => {
        console.log('Profile: Livre mis à jour reçu:', updatedBook.title);
        // Mettre à jour la liste des livres
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book._id === updatedBook._id ? updatedBook : book
          )
        );
      }
    );

    // Aussi écouter les événements de suppression
    const unsubscribeDeleted = bookEventManager.subscribe(
      EVENTS.BOOK_DELETED,
      (deletedBookId) => {
        console.log('Profile: Livre supprimé reçu:', deletedBookId);
        setBooks((prevBooks) =>
          prevBooks.filter((book) => book._id !== deletedBookId)
        );
      }
    );

    return () => {
      unsubscribe();
      unsubscribeDeleted();
    };
  }, []);

  const fetchUserBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getAll();
      setBooks(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des livres:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = () => {
    // Simulation de sauvegarde
    console.log("Profil sauvegardé:", profileData);
    setEditMode(false);
    // Ici, on ferait un appel API pour sauvegarder les données
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Statistiques de lecture
  const getReadingStats = () => {
    const currentYear = new Date().getFullYear();
    const readBooks = books.filter((book) => book.status === "terminé");
    const readThisYear = readBooks.filter((book) => {
      const readDate = new Date(book.readDate || book.createdAt);
      return readDate.getFullYear() === currentYear;
    });

    const totalPages = readBooks.reduce(
      (sum, book) => sum + (book.pages || 0),
      0
    );
    const pagesThisYear = readThisYear.reduce(
      (sum, book) => sum + (book.pages || 0),
      0
    );

    // Calculer les pages lues actuellement (en cours de lecture)
    const currentlyReading = books.filter((book) => book.status === "en cours");
    const currentPages = currentlyReading.reduce(
      (sum, book) => sum + (book.currentPage || 0),
      0
    );

    const favoriteGenres = {};
    readBooks.forEach((book) => {
      if (book.genre || book.category) {
        const genre = book.genre || book.category;
        favoriteGenres[genre] = (favoriteGenres[genre] || 0) + 1;
      }
    });

    const topGenre =
      Object.entries(favoriteGenres).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "Aucun";

    return {
      totalBooks: readBooks.length,
      booksThisYear: readThisYear.length,
      totalPages: totalPages + currentPages, // Total des pages terminées + pages en cours
      pagesThisYear: pagesThisYear + currentPages, // Pages cette année + pages en cours
      topGenre,
      readingGoal: parseInt(profileData.readingGoal) || 12,
      goalProgress: Math.min(
        (readThisYear.length / (parseInt(profileData.readingGoal) || 12)) * 100,
        100
      ),
    };
  };

  // Badges obtenus
  const getBadges = () => {
    const stats = getReadingStats();
    const badges = [];

    if (stats.totalBooks >= 1) {
      badges.push({
        name: "Premier livre",
        description: "Votre première lecture",
      });
    }
    if (stats.totalBooks >= 10) {
      badges.push({ name: "Lecteur assidu", description: "10 livres lus" });
    }
    if (stats.totalBooks >= 25) {
      badges.push({ name: "Bibliophile", description: "25 livres lus" });
    }
    if (stats.totalBooks >= 50) {
      badges.push({ name: "Dévoreur de livres", description: "50 livres lus" });
    }
    if (stats.booksThisYear >= 12) {
      badges.push({
        name: "Objectif annuel",
        description: "12 livres en un an",
      });
    }
    if (stats.totalPages >= 500) {
      badges.push({ name: "500 pages", description: "500 pages lues" });
    }
    if (stats.totalPages >= 1000) {
      badges.push({ name: "Mille pages", description: "1000 pages lues" });
    }
    if (stats.totalPages >= 5000) {
      badges.push({ name: "Grand lecteur", description: "5000 pages lues" });
    }

    return badges;
  };

  const stats = getReadingStats();
  const badges = getBadges();

  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Vérification de l'authentification...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bento-container">
      <div className="bento-card">
        <div className="bento-header">
          <h1 className="bento-title">Mon profil</h1>
          <p className="bento-subtitle">
            Gérez vos informations personnelles et suivez vos progrès
          </p>
          <button
            onClick={fetchUserBooks}
            className="refresh-button"
            disabled={loading}
            title="Actualiser les données"
          >
            {loading ? "⏳" : "🔄"}
          </button>
        </div>
      </div>

      {/* Informations du profil */}
      <div className="bento-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-initials">
              {(profileData.name || "U").charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="profile-info">
            <h2 className="profile-name">
              {profileData.name || "Utilisateur"}
            </h2>
            <p className="profile-email">{profileData.email}</p>
            <p className="profile-level">Niveau {user.level || 1}</p>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="edit-button"
          >
            {editMode ? "Annuler" : "Modifier"}
          </button>
        </div>

        {/* Formulaire d'édition */}
        {editMode && (
          <div className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Nom</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Biographie</label>
              <textarea
                id="bio"
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                placeholder="Parlez-nous de vous et de vos goûts littéraires..."
                rows="4"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="favoriteGenre">Genre préféré</label>
              <input
                type="text"
                id="favoriteGenre"
                name="favoriteGenre"
                value={profileData.favoriteGenre}
                onChange={handleInputChange}
                placeholder="Roman, Science-fiction, Fantasy..."
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="readingGoal">Objectif de lecture annuel</label>
              <input
                type="number"
                id="readingGoal"
                name="readingGoal"
                value={profileData.readingGoal}
                onChange={handleInputChange}
                min="1"
                max="100"
                className="form-input"
              />
            </div>
            <div className="form-actions">
              <button onClick={handleSaveProfile} className="save-button">
                Sauvegarder
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="cancel-button"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Affichage des informations */}
        {!editMode && (
          <div className="profile-details">
            {profileData.bio && (
              <div className="detail-item">
                <h3>Biographie</h3>
                <p>{profileData.bio}</p>
              </div>
            )}
            {profileData.favoriteGenre && (
              <div className="detail-item">
                <h3>Genre préféré</h3>
                <p>{profileData.favoriteGenre}</p>
              </div>
            )}
            <div className="detail-item">
              <h3>Objectif de lecture</h3>
              <p>{profileData.readingGoal} livres par an</p>
            </div>
          </div>
        )}
      </div>

      {/* Statistiques de lecture */}
      <div className="bento-card">
        <div className="bento-header">
          <h2 className="bento-title">Statistiques de lecture</h2>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalBooks}</div>
            <div className="stat-label">Livres lus</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.booksThisYear}</div>
            <div className="stat-label">Cette année</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalPages}</div>
            <div className="stat-label">Pages lues</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.topGenre}</div>
            <div className="stat-label">Genre préféré</div>
          </div>
        </div>
      </div>

      {/* Objectif de lecture */}
      <div className="bento-card">
        <div className="bento-header">
          <h2 className="bento-title">
            Objectif de lecture {new Date().getFullYear()}
          </h2>
        </div>
        <div className="goal-progress">
          <div className="goal-info">
            <span className="goal-text">
              {stats.booksThisYear} / {stats.readingGoal} livres
            </span>
            <span className="goal-percentage">
              {Math.round(stats.goalProgress)}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${stats.goalProgress}%` }}
            ></div>
          </div>
        </div>
        {stats.goalProgress >= 100 && (
          <p className="goal-achieved">🎉 Objectif atteint ! Félicitations !</p>
        )}
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="bento-card">
          <div className="bento-header">
            <h2 className="bento-title">Badges obtenus</h2>
          </div>
          <div className="badges-grid">
            {badges.map((badge, index) => (
              <div key={index} className="badge-card">
                <div className="badge-name">{badge.name}</div>
                <div className="badge-description">{badge.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bento-card">
        <div className="bento-actions">
          <button onClick={handleLogout} className="logout-button">
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
