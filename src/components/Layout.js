import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/dashboard">URL Kısaltıcı</Link>
        </div>
        <div className="nav-menu">
          <div className="dropdown">
            <button 
              className="dropdown-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg 
                className="user-icon" 
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            {isMenuOpen && (
              <div className="dropdown-menu">
                <Link 
                  to="/profile" 
                  className="dropdown-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profil
                </Link>
                <Link 
                  to="/subscription" 
                  className="dropdown-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Abonelik
                </Link>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }} 
                  className="dropdown-item logout-button"
                >
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 