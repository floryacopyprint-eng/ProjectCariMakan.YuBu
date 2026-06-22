import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import FoodCard from '../components/FoodCard';
import Loading from '../components/Loading';
import { getFoods, addFavorite, removeFavorite, getFavoritesByUser } from '../services/api';
import './Home.css';

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const userId = 1; // Hardcoded untuk demo, seharusnya dari auth

  useEffect(() => {
    loadFoods();
    loadFavorites();
  }, []);

  useEffect(() => {
    filterFoods();
  }, [searchQuery, foods]);

  const loadFoods = async () => {
    try {
      setLoading(true);
      const response = await getFoods();
      setFoods(response.data.data);
      setFilteredFoods(response.data.data);
    } catch (error) {
      console.error('Error fetching foods:', error);
      alert('Gagal memuat data makanan');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await getFavoritesByUser(userId);
      setFavorites(response.data.data.map(fav => fav.id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const filterFoods = () => {
    if (searchQuery.trim() === '') {
      setFilteredFoods(foods);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = foods.filter(food =>
        food.name.toLowerCase().includes(query) ||
        (food.description && food.description.toLowerCase().includes(query))
      );
      setFilteredFoods(filtered);
    }
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleSearch = () => {
    // Already filtered by onChange
    console.log('Searching for:', searchQuery);
  };

  const handleFavoriteToggle = async (foodId) => {
    try {
      if (favorites.includes(foodId)) {
        await removeFavorite(userId, foodId);
        setFavorites(favorites.filter(fav => fav !== foodId));
      } else {
        await addFavorite({ user_id: userId, food_id: foodId });
        setFavorites([...favorites, foodId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Gagal mengubah favorit');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <Loading message="Memuat makanan..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="home">
        <div className="container">
          <div className="hero">
            <h2>Cari Makanan Favorit Anda</h2>
            <p>Temukan ribuan pilihan makanan dari restoran terbaik</p>
          </div>

          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            onSearch={handleSearch}
          />

          <div className="foods-section">
            {filteredFoods.length > 0 ? (
              <>
                <h3>
                  {searchQuery
                    ? `Hasil pencarian: "${searchQuery}" (${filteredFoods.length})`
                    : `Semua Makanan (${filteredFoods.length})`}
                </h3>
                <div className="foods-grid">
                  {filteredFoods.map(food => (
                    <FoodCard
                      key={food.id}
                      food={food}
                      onFavorite={handleFavoriteToggle}
                      isFavorite={favorites.includes(food.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="no-results">
                <p>😕 Tidak ada makanan yang cocok dengan "{searchQuery}"</p>
                <button
                  className="reset-btn"
                  onClick={() => setSearchQuery('')}
                >
                  Lihat Semua Makanan
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Home;
