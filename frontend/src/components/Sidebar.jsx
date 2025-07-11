import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Bouton menu hamburger (mobile seulement) */}
      <button
        className="mobile-menu-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay pour fermer la sidebar sur mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <img src="/logo.png" alt="BookBuddy Logo" className="logo-image" />
          </div>
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">{user?.name || "Utilisateur"}</span>
              <span className="user-level">Niveau {user?.level || 1}</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link
                to="/"
                className={`nav-link ${isActive("/") ? "active" : ""}`}
                onClick={closeSidebar}
              >
                <span className="nav-text">Accueil</span>
              </Link>
            </li>
            <li>
              <Link
                to="/books"
                className={`nav-link ${isActive("/books") ? "active" : ""}`}
                onClick={closeSidebar}
              >
                <span className="nav-text">Ma bibliothèque</span>
              </Link>
            </li>
            <li>
              <Link
                to="/reading"
                className={`nav-link ${isActive("/reading") ? "active" : ""}`}
                onClick={closeSidebar}
              >
                <span className="nav-text">Lectures en cours</span>
              </Link>
            </li>
            <li>
              <Link
                to="/favorites"
                className={`nav-link ${isActive("/favorites") ? "active" : ""}`}
                onClick={closeSidebar}
              >
                <span className="nav-text">Favoris</span>
              </Link>
            </li>
            <li>
              <Link
                to="/statistics"
                className={`nav-link ${
                  isActive("/statistics") ? "active" : ""
                }`}
                onClick={closeSidebar}
              >
                <span className="nav-text">Statistiques</span>
              </Link>
            </li>
            <li>
              <Link
                to="/discover"
                className={`nav-link ${isActive("/discover") ? "active" : ""}`}
                onClick={closeSidebar}
              >
                <span className="nav-text">Découvrir</span>
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={`nav-link ${isActive("/profile") ? "active" : ""}`}
                onClick={closeSidebar}
              >
                <span className="nav-text">Mon profil</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="nav-text">Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
