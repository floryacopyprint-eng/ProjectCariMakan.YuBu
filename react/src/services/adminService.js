import api from './api';

// =====================
// DASHBOARD
// =====================
export const getDashboard = async () => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Error fetching dashboard' };
  }
};

// =====================
// FOODS
// =====================
export const adminGetFoods = async () => {
  try {
    const response = await api.get('/admin/foods');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Error fetching foods' };
  }
};

export const adminGetFoodById = async (id) => {
  try {
    const response = await api.get(`/admin/foods/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Error fetching food' };
  }
};

export const adminCreateFood = async (foodData) => {
  try {
    const response = await api.post('/admin/foods', foodData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Error creating food' };
  }
};

export const adminUpdateFood = async (id, foodData) => {
  try {
    const response = await api.put(`/admin/foods/${id}`, foodData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Error updating food' };
  }
};

export const adminDeleteFood = async (id) => {
  try {
    const response = await api.delete(`/admin/foods/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Error deleting food' };
  }
};

// =====================
// USERS
// =====================
export const adminGetUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Error fetching users' };
  }
};

export const adminUpdateUserProfile = async (userId, profileData) => {
  try {
    const response = await api.put(`/admin/users/${userId}/profile`, profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Error updating user profile' };
  }
};

export const adminUpdateUserStatus = async (userId, isActive) => {
  try {
    const response = await api.put(`/admin/users/${userId}/status`, { is_active: isActive });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Error updating user status' };
  }
};

export const adminUpdateUserRole = async (userId, roleId) => {
  try {
    const response = await api.put(`/admin/users/${userId}/role`, { role_id: roleId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Error updating user role' };
  }
};

// =====================
// ORDERS
// =====================
export const adminGetOrders = async () => {
  try {
    const response = await api.get('/admin/orders');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Error fetching orders' };
  }
};

export const adminUpdateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Error updating order status' };
  }
};
