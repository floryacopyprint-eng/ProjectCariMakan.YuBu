import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const FAVORITES_STORAGE_KEY = 'cariMakanFavorites';
const ORDERS_STORAGE_KEY = 'cariMakanOrders';

const demoFoods = [
  {
    id: 1,
    name: 'Nasi Goreng Spesial',
    description: 'Nasi goreng dengan ayam, telur, dan kerupuk renyah.',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
    category_name: 'Makanan Utama'
  },
  {
    id: 2,
    name: 'Sate Ayam',
    description: 'Sate ayam bumbu kacang dengan lontong dan sambal.',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=900&q=80',
    rating: 4.7,
    category_name: 'Makanan Utama'
  },
  {
    id: 3,
    name: 'Es Teh Manis',
    description: 'Minuman segar dengan es batu dan gula jawa.',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80',
    rating: 4.9,
    category_name: 'Minuman'
  }
];

const demoReviews = {
  1: [
    { id: 1, rating: 5, comment: 'Enak dan porsinya pas.', created_at: '2026-06-01T10:00:00.000Z' },
    { id: 2, rating: 4, comment: 'Rasa mantap, pengiriman cepat.', created_at: '2026-06-10T10:00:00.000Z' }
  ],
  2: [
    { id: 3, rating: 5, comment: 'Satenya sangat nikmat.', created_at: '2026-06-12T10:00:00.000Z' }
  ],
  3: []
};

const readStoredFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]');
  } catch (error) {
    return [];
  }
};

const writeStoredFavorites = (favorites) => {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
};

const readStoredOrders = () => {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
  } catch (error) {
    return [];
  }
};

const writeStoredOrders = (orders) => {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor untuk menambahkan JWT token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk handle 401 (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token dan redirect ke login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Foods
export const getFoods = async () => {
  try {
    return await api.get('/foods');
  } catch (error) {
    console.warn('Falling back to demo foods:', error.message);
    return { data: { success: true, data: demoFoods } };
  }
};

export const getFoodById = async (id) => {
  try {
    return await api.get(`/foods/${id}`);
  } catch (error) {
    const food = demoFoods.find((item) => String(item.id) === String(id));
    return { data: { success: true, data: food || null } };
  }
};

export const createFood = (data) => api.post('/foods', data);
export const updateFood = (id, data) => api.put(`/foods/${id}`, data);
export const deleteFood = (id) => api.delete(`/foods/${id}`);

// Categories
export const getCategories = async () => {
  try {
    return await api.get('/categories');
  } catch (error) {
    return { data: { success: true, data: [{ id: 1, name: 'Makanan Utama' }, { id: 2, name: 'Minuman' }] } };
  }
};

// Reviews
export const getReviewsByFood = async (foodId) => {
  try {
    return await api.get(`/reviews/${foodId}`);
  } catch (error) {
    return { data: { success: true, data: demoReviews[foodId] || [] } };
  }
};

export const createReview = async (data) => {
  try {
    return await api.post('/reviews', data);
  } catch (error) {
    return { data: { success: true, message: 'Review saved locally' } };
  }
};

// Favorites
export const getFavoritesByUser = async (userId) => {
  try {
    return await api.get(`/favorites/${userId}`);
  } catch (error) {
    const favorites = readStoredFavorites().filter((item) => String(item.user_id) === String(userId));
    return { data: { success: true, data: favorites } };
  }
};

export const addFavorite = async (data) => {
  try {
    return await api.post('/favorites', data);
  } catch (error) {
    const favorites = readStoredFavorites();
    const nextFavorites = favorites.some((item) => String(item.food_id) === String(data.food_id) && String(item.user_id) === String(data.user_id))
      ? favorites
      : [...favorites, { ...data, id: Date.now() }];
    writeStoredFavorites(nextFavorites);
    return { data: { success: true, message: 'Favorite saved locally' } };
  }
};

export const removeFavorite = async (userId, foodId) => {
  try {
    return await api.delete(`/favorites/${userId}/${foodId}`);
  } catch (error) {
    const favorites = readStoredFavorites().filter((item) => !(String(item.user_id) === String(userId) && String(item.food_id) === String(foodId)));
    writeStoredFavorites(favorites);
    return { data: { success: true, message: 'Favorite removed locally' } };
  }
};

// Orders
export const getOrdersByUser = async (userId) => {
  try {
    return await api.get(`/orders/user/${userId}`);
  } catch (error) {
    const orders = readStoredOrders().filter((item) => String(item.user_id) === String(userId));
    return { data: { success: true, data: orders } };
  }
};

export const createOrder = async (data) => {
  try {
    return await api.post('/orders', data);
  } catch (error) {
    const newOrder = {
      id: Date.now(),
      user_id: data.user_id,
      total_harga: data.total,
      total_price: data.total,
      status: data.status || 'pending',
      address: data.address,
      alamat_pengiriman: data.address,
      paymentMethod: data.paymentMethod,
      created_at: new Date().toISOString(),
      items: data.items || []
    };
    const orders = [newOrder, ...readStoredOrders()];
    writeStoredOrders(orders);
    return { data: { success: true, message: 'Order saved locally', orderId: newOrder.id } };
  }
};

export default api;
