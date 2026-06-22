import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>🍽️ CariMakan</h1>
        </div>
        <nav className="nav">
          <a href="/">Home</a>
          <a href="/favorites">Favorit</a>
          <a href="/orders">Pesanan</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
