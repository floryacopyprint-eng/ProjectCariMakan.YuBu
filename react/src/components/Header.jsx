import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CartBadge from './CartBadge';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>🍽️ CariMakan</h1>
          <p>jl. pekalongan barat</p>
        </div>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/favorites">Favorit</Link>
          <Link to="/my-orders">Pesanan</Link>
          <CartBadge />

          {isAuthenticated() ? (
            <div className="auth-menu">
              <span className="user-name">Halo, {user?.nama || user?.username}!</span>
              {user?.role_id === 1 && (
                <Link to="/admin" className="btn-admin">📊 Admin Panel</Link>
              )}
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          ) : (
            <div className="auth-menu">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Daftar</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
