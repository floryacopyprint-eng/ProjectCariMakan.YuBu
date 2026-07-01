// Response formatter untuk normalize column names dari database ke API response

// Format food object untuk API response
exports.formatFood = (dbFood) => {
  return {
    id: dbFood.food_id,
    food_id: dbFood.food_id,
    name: dbFood.nama_makanan,
    nama_makanan: dbFood.nama_makanan,
    description: dbFood.deskripsi,
    deskripsi: dbFood.deskripsi,
    price: dbFood.harga,
    harga: dbFood.harga,
    image: dbFood.gambar,
    gambar: dbFood.gambar,
    category_id: dbFood.category_id,
    category_name: dbFood.nama_kategori || dbFood.category_name,
    rating: dbFood.rating,
    origin: dbFood.asal_daerah,
    asal_daerah: dbFood.asal_daerah,
    alamat_resto: dbFood.alamat_resto,
    is_active: dbFood.is_active,
    created_at: dbFood.created_at
  };
};

// Format foods array
exports.formatFoods = (dbFoods) => {
  return dbFoods.map(food => exports.formatFood(food));
};

// Format category object
exports.formatCategory = (dbCategory) => {
  return {
    id: dbCategory.category_id,
    category_id: dbCategory.category_id,
    name: dbCategory.nama_kategori,
    nama_kategori: dbCategory.nama_kategori,
    description: dbCategory.deskripsi,
    deskripsi: dbCategory.deskripsi
  };
};

// Format categories array
exports.formatCategories = (dbCategories) => {
  return dbCategories.map(cat => exports.formatCategory(cat));
};

// Format review object
exports.formatReview = (dbReview) => {
  return {
    id: dbReview.review_id,
    review_id: dbReview.review_id,
    user_id: dbReview.user_id,
    food_id: dbReview.food_id,
    rating: dbReview.rating,
    comment: dbReview.komentar,
    komentar: dbReview.komentar,
    user_name: dbReview.user_name || dbReview.nama,
    food_name: dbReview.food_name || dbReview.nama_makanan,
    created_at: dbReview.created_at
  };
};

// Format reviews array
exports.formatReviews = (dbReviews) => {
  return dbReviews.map(review => exports.formatReview(review));
};

// Format favorite object
exports.formatFavorite = (dbFavorite) => {
  return {
    favorite_id: dbFavorite.favorite_id,
    id: dbFavorite.food_id,
    food_id: dbFavorite.food_id,
    user_id: dbFavorite.user_id,
    name: dbFavorite.nama_makanan,
    nama_makanan: dbFavorite.nama_makanan,
    description: dbFavorite.deskripsi,
    price: dbFavorite.harga,
    image: dbFavorite.gambar,
    category_name: dbFavorite.nama_kategori,
    rating: dbFavorite.rating,
    created_at: dbFavorite.created_at
  };
};

// Format favorites array
exports.formatFavorites = (dbFavorites) => {
  return dbFavorites.map(fav => exports.formatFavorite(fav));
};

// Format order object
exports.formatOrder = (dbOrder) => {
  return {
    order_id: dbOrder.order_id,
    id: dbOrder.order_id,
    user_id: dbOrder.user_id,
    total_harga: dbOrder.total_harga,
    total_price: dbOrder.total_harga,
    status: dbOrder.status,
    items: dbOrder.items,
    item_count: dbOrder.item_count,
    created_at: dbOrder.created_at,
    address: dbOrder.alamat_pengiriman || dbOrder.address,
    alamat_pengiriman: dbOrder.alamat_pengiriman || dbOrder.address,
    notes: dbOrder.catatan || dbOrder.notes,
    catatan: dbOrder.catatan || dbOrder.notes,
    paymentMethod: dbOrder.payment_method || dbOrder.paymentMethod,
    payment_method: dbOrder.payment_method || dbOrder.paymentMethod,
    customer: dbOrder.customer || dbOrder.nama_pelanggan,
    nama_pelanggan: dbOrder.customer || dbOrder.nama_pelanggan,
    phone: dbOrder.phone || dbOrder.nomor_hp,
    nomor_hp: dbOrder.phone || dbOrder.nomor_hp
  };
};

// Format orders array
exports.formatOrders = (dbOrders) => {
  return dbOrders.map(order => exports.formatOrder(order));
};
