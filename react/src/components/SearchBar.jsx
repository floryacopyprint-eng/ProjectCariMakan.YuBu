import React from 'react';
import './SearchBar.css';

const SearchBar = ({ value, onChange, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="searchbar">
      <form onSubmit={handleSubmit}>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Cari makanan, kategori, atau restoran..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            🔍 Cari
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
