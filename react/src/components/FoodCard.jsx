import React from 'react';
import { Link } from 'react-router-dom';
import './FoodCard.css';

const FoodCard = ({ food, onFavorite, isFavorite }) => {
  const handleFavoriteClick = () => {
    onFavorite(food.id);
  };

  const defaultImage = 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(food.name);

  return (
    <div className="food-card">
      <div className="food-image">
        <img src={food.image || defaultImage} alt={food.name} />
        <button 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="food-content">
        <h3>{food.name}</h3>
        <p className="description">{food.description?.substring(0, 60)}...</p>
        <div className="food-meta">
          <span className="rating">⭐ {food.rating || 0}</span>
          <span className="price">Rp {food.price?.toLocaleString('id-ID')}</span>
        </div>
        <Link to={`/food/${food.id}`} className="detail-btn">
          Lihat Detail →
        </Link>
      </div>
    </div>
  );
};

export default FoodCard;
