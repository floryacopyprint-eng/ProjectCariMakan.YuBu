import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import {
  getFoodById,
  getReviewsByFood,
  createReview,
  addFavorite,
  removeFavorite,
  getFavoritesByUser,
  createOrder
} from '../services/api';
import './FoodDetail.css';

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const userId = 1; // Hardcoded untuk demo

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const foodResponse = await getFoodById(id);
      setFood(foodResponse.data.data);

      const reviewsResponse = await getReviewsByFood(id);
      setReviews(reviewsResponse.data.data);

      const favResponse = await getFavoritesByUser(userId);
      const isFav = favResponse.data.data.some(fav => fav.id === parseInt(id));
      setIsFavorite(isFav);
    } catch (error) {
      console.error('Error loading food detail:', error);
      alert('Gagal memuat detail makanan');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        await removeFavorite(userId, id);
      } else {
        await addFavorite({ user_id: userId, food_id: id });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Gagal mengubah favorit');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      alert('Silakan masukkan komentar');
      return;
    }

    try {
      setSubmittingReview(true);
      await createReview({
        user_id: userId,
        food_id: id,
        rating: newReview.rating,
        comment: newReview.comment
      });

      alert('Review berhasil ditambahkan!');
      setNewReview({ rating: 5, comment: '' });
      loadData(); // Reload reviews
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Gagal menambahkan review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleOrder = async () => {
    try {
      await createOrder({
        user_id: userId,
        items: [{
          food_id: parseInt(id),
          quantity: quantity,
          price: food.price
        }],
        total_price: food.price * quantity,
        status: 'pending'
      });
      alert('Pesanan berhasil dibuat!');
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Gagal membuat pesanan');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <Loading message="Memuat detail makanan..." />
        <Footer />
      </>
    );
  }

  if (!food) {
    return (
      <>
        <Header />
        <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
          <p>Makanan tidak ditemukan</p>
          <Link to="/" className="back-link">← Kembali ke Home</Link>
        </div>
        <Footer />
      </>
    );
  }

  const defaultImage = 'https://via.placeholder.com/600x400?text=' + encodeURIComponent(food.name);

  return (
    <>
      <Header />
      <main className="food-detail">
        <div className="container">
          <Link to="/" className="back-link">← Kembali</Link>

          <div className="detail-grid">
            <div className="detail-image">
              <img src={food.image || defaultImage} alt={food.name} />
            </div>

            <div className="detail-info">
              <div className="detail-header">
                <h1>{food.name}</h1>
                <button
                  className={`favorite-btn-large ${isFavorite ? 'active' : ''}`}
                  onClick={handleFavoriteToggle}
                >
                  {isFavorite ? '❤️ Hapus Favorit' : '🤍 Simpan Favorit'}
                </button>
              </div>

              <div className="detail-meta">
                <span className="rating-badge">⭐ Rating: {food.rating || 0}</span>
                <span className="price-badge">Rp {food.price?.toLocaleString('id-ID')}</span>
              </div>

              <div className="detail-description">
                <h3>Deskripsi</h3>
                <p>{food.description}</p>
              </div>

              <div className="order-section">
                <div className="quantity-selector">
                  <label htmlFor="quantity">Jumlah:</label>
                  <div className="quantity-input">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                    />
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                </div>

                <div className="total-price">
                  Total: Rp {(food.price * quantity).toLocaleString('id-ID')}
                </div>

                <button className="order-btn" onClick={handleOrder}>
                  🛒 Pesan Sekarang
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <section className="reviews-section">
            <h2>Review & Penilaian</h2>

            {/* Add Review Form */}
            <div className="review-form">
              <h3>Tambahkan Review Anda</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label htmlFor="rating">Rating:</label>
                  <select
                    id="rating"
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                  >
                    <option value="1">1 - Sangat Buruk</option>
                    <option value="2">2 - Buruk</option>
                    <option value="3">3 - Biasa Saja</option>
                    <option value="4">4 - Baik</option>
                    <option value="5">5 - Sangat Baik</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="comment">Komentar:</label>
                  <textarea
                    id="comment"
                    rows="4"
                    placeholder="Bagikan pengalaman Anda..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="submit-review-btn" disabled={submittingReview}>
                  {submittingReview ? 'Mengirim...' : 'Kirim Review'}
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="reviews-list">
              <h3>Review dari Pelanggan ({reviews.length})</h3>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <span className="review-rating">⭐ {review.rating}/5</span>
                      <span className="review-date">
                        {new Date(review.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="no-reviews">Belum ada review. Jadilah yang pertama!</p>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FoodDetail;
