CREATE DATABASE IF NOT EXISTS carimakan_db;
USE carimakan_db;

-- =====================
-- ROLE / AUTH
-- =====================
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    nama_role VARCHAR(20) NOT NULL UNIQUE,
    deskripsi VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    nama VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    foto_profil VARCHAR(255) DEFAULT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id)
        REFERENCES roles(role_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- =====================
-- KATEGORI MAKANAN
-- =====================
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL UNIQUE,
    deskripsi TEXT DEFAULT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- =====================
-- MAKANAN
-- =====================
CREATE TABLE foods (
    food_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT DEFAULT NULL,
    nama_makanan VARCHAR(150) NOT NULL,
    deskripsi TEXT DEFAULT NULL,
    harga DECIMAL(10,2) NOT NULL,
    gambar VARCHAR(255) DEFAULT NULL,
    rating DECIMAL(2,1) DEFAULT 0,
    asal_daerah VARCHAR(100) DEFAULT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_foods_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- =====================
-- FAVORIT USER
-- =====================
CREATE TABLE favorites (
    favorite_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    food_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_favorites_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_favorites_food
        FOREIGN KEY (food_id)
        REFERENCES foods(food_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    UNIQUE (user_id, food_id)
);

-- =====================
-- REVIEW MAKANAN
-- =====================
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    food_id INT NOT NULL,
    rating INT NOT NULL,
    komentar TEXT DEFAULT NULL,
    is_visible TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_reviews_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_reviews_food
        FOREIGN KEY (food_id)
        REFERENCES foods(food_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_reviews_rating
        CHECK (rating BETWEEN 1 AND 5)
);

-- =====================
-- PESANAN
-- =====================
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_harga DECIMAL(12,2) DEFAULT 0,
    status ENUM(
        'pending',
        'diproses',
        'dikirim',
        'selesai',
        'dibatalkan'
    ) DEFAULT 'pending',
    alamat_pengiriman TEXT DEFAULT NULL,
    catatan TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =====================
-- DETAIL PESANAN
-- =====================
CREATE TABLE order_details (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    food_id INT NOT NULL,
    jumlah INT NOT NULL,
    harga_satuan DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(12,2) GENERATED ALWAYS AS
        (jumlah * harga_satuan) STORED,

    CONSTRAINT fk_order_details_order
        FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_order_details_food
        FOREIGN KEY (food_id)
        REFERENCES foods(food_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_order_details_jumlah
        CHECK (jumlah > 0)
);

-- =====================
-- SEED DATA
-- =====================
INSERT INTO roles (nama_role, deskripsi)
VALUES
('admin', 'Administrator yang mengelola data dan pesanan'),
('user', 'Pengguna yang dapat login dan memesan makanan');

INSERT INTO categories (nama_kategori, deskripsi)
VALUES
('Makanan Utama', 'Berbagai makanan utama'),
('Minuman', 'Berbagai minuman segar'),
('Dessert', 'Camilan manis setelah makan');

INSERT INTO users (role_id, nama, username, email, password)
VALUES
(1, 'Admin CariMakan', 'admin', 'admin@carimakan.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(2, 'Demo User', 'demo', 'demo@carimakan.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

INSERT INTO foods
(category_id, nama_makanan, deskripsi, harga, gambar, rating, asal_daerah)
VALUES
(1, 'Rendang', 'Masakan khas Padang', 35000, 'rendang.jpg', 4.8, 'Sumatera Barat'),
(1, 'Sate Padang', 'Sate khas Padang', 25000, 'sate-padang.jpg', 4.6, 'Sumatera Barat'),
(1, 'Nasi Goreng', 'Nasi goreng spesial', 20000, 'nasigoreng.jpg', 4.5, 'Indonesia');

-- Optional sample order data
INSERT INTO orders (user_id, total_harga, status, alamat_pengiriman, catatan)
VALUES
(2, 60000, 'pending', 'Jl. Merdeka No. 1', 'Tanpa sambal');

INSERT INTO order_details (order_id, food_id, jumlah, harga_satuan)
VALUES
(1, 1, 1, 35000),
(1, 2, 1, 25000);