import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>CariMakan</h3>
          <p>Temukan makanan favorit Anda dengan mudah dan cepat.</p>
        </div>
        <div className="footer-section">
          <h3>Navigasi</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/favorites">Favorit</a></li>
            <li><a href="/orders">Pesanan</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Kontak</h3>
          <ul>
            <li>Email: info@carimakan.com</li>
            <li>Phone: +62-8xx-xxxx-xxxx</li>
            <li>Alamat: Jakarta, Indonesia</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 CariMakan. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
