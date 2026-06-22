import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import { getFavoritesByUser, removeFavorite } from '../services/api';
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = 1; // Hardcoded untuk demo

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await getFavoritesByUser(userId);
      setFavorites(response.data.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      alert('Gagal memuat favorit');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (foodId) => {
    try {
      await removeFavorite(userId, foodId);
      setFavorites(favorites.filter(fav => fav.id !== foodId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Gagal menghapus favorit');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <Loading message="Memuat favorit..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="favorites">
        <div className="container">
          <h1>📌 Makanan Favorit Saya</h1>

          {favorites.length > 0 ? (
            <div className="favorites-grid">
              {favorites.map(food => (
                <div key={food.id} className="favorite-card">
                  <div className="favorite-image">
                    <img
                      src={food.image || 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(food.name)}
                      alt={food.name}
                    />
                  </div>
                  <div className="favorite-content">
                    <h3>{food.name}</h3>
                    <p className="description">{food.description?.substring(0, 80)}...</p>
                    <div className="favorite-meta">
                      <span className="rating">⭐ {food.rating || 0}</span>
                      <span className="price">Rp {food.price?.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="favorite-actions">
                      <Link to={`/food/${food.id}`} className="view-btn">
                        Lihat Detail
                      </Link>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveFavorite(food.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-favorites">
              <p>😔 Belum ada makanan favorit</p>
              <Link to="/" className="back-to-home">
                Lihat Menu Makanan
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Favorites;
