import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Foods
export const getFoods = () => api.get('/foods');
export const getFoodById = (id) => api.get(`/foods/${id}`);
export const createFood = (data) => api.post('/foods', data);
export const updateFood = (id, data) => api.put(`/foods/${id}`, data);
export const deleteFood = (id) => api.delete(`/foods/${id}`);

// Categories
export const getCategories = () => api.get('/categories');

// Reviews
export const getReviewsByFood = (foodId) => api.get(`/reviews/${foodId}`);
export const createReview = (data) => api.post('/reviews', data);

// Favorites
export const getFavoritesByUser = (userId) => api.get(`/favorites/${userId}`);
export const addFavorite = (data) => api.post('/favorites', data);
export const removeFavorite = (userId, foodId) => api.delete(`/favorites/${userId}/${foodId}`);

// Orders
export const getOrdersByUser = (userId) => api.get(`/orders/${userId}`);
export const createOrder = (data) => api.post('/orders', data);

export default api;
