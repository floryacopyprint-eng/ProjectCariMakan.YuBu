# 🍽️ CariMakan - Aplikasi Food Ordering Fullstack

Aplikasi fullstack untuk mencari dan memesan makanan dari berbagai restoran.

## 📋 Tech Stack

### Frontend
- React.js 19
- React Router DOM 7
- Axios 1.18
- Vite 8
- CSS Modern (No Tailwind)

### Backend
- Node.js
- Express.js 5
- MySQL 8
- mysql2 3
- dotenv 16
- cors 2.8

## 🗂️ Project Structure

```
project-kelompok/
├── react/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FoodCard.jsx
│   │   │   └── Loading.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── FoodDetail.jsx
│   │   │   ├── Favorites.jsx
│   │   │   └── Orders.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── assets/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── express/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── foodController.js
    │   ├── categoryController.js
    │   ├── reviewController.js
    │   ├── favoriteController.js
    │   └── orderController.js
    ├── routes/
    │   ├── foodRoutes.js
    │   ├── categoryRoutes.js
    │   ├── reviewRoutes.js
    │   ├── favoriteRoutes.js
    │   └── orderRoutes.js
    ├── .env
    ├── .gitignore
    ├── package.json
    └── server.js
```

## 🚀 Quick Start

### Jalankan dengan satu klik (Windows)
- Jalankan file [run-dev.bat](run-dev.bat)
- Backend akan berjalan di http://localhost:5000
- Frontend akan berjalan di http://localhost:5173

### Prerequisites
- Node.js v16 atau lebih tinggi
- MySQL 8 dengan database `carimakan_db` sudah dibuat
- Tabel-tabel: users, categories, foods, favorites, reviews, orders, order_details

### Setup Backend

1. Masuk ke folder express:
```bash
cd express
```

2. Install dependencies:
```bash
npm install
```

3. Konfigurasi `.env` file (sudah tersedia):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=carimakan_db
DB_PORT=3306
PORT=5000
NODE_ENV=development
```

4. Update `.env` sesuai konfigurasi MySQL Anda jika berbeda

5. Jalankan server:
```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

### Setup Frontend

1. Masuk ke folder react:
```bash
cd react
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan dev server:
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## 📡 API Endpoints

### Foods
- `GET /api/foods` - Dapatkan semua makanan
- `GET /api/foods/:id` - Dapatkan detail makanan
- `POST /api/foods` - Buat makanan baru
- `PUT /api/foods/:id` - Update makanan
- `DELETE /api/foods/:id` - Hapus makanan

### Categories
- `GET /api/categories` - Dapatkan semua kategori

### Reviews
- `GET /api/reviews/:foodId` - Dapatkan reviews makanan
- `POST /api/reviews` - Buat review baru

### Favorites
- `GET /api/favorites/:userId` - Dapatkan favorit user
- `POST /api/favorites` - Tambah favorit
- `DELETE /api/favorites/:userId/:foodId` - Hapus favorit

### Orders
- `GET /api/orders/:userId` - Dapatkan pesanan user
- `POST /api/orders` - Buat pesanan baru

## 🎨 Features

### Frontend
✓ Home page dengan grid makanan
✓ Search/filter makanan realtime
✓ Detail page makanan
✓ Review system dengan rating
✓ Favorites system
✓ Order system
✓ Responsive design
✓ Modern UI dengan gradients dan shadows
✓ Smooth animations

### Backend
✓ REST API dengan async/await
✓ Error handling dengan try/catch
✓ Database connection pooling
✓ CORS configuration
✓ Environment variables
✓ Structured code organization
✓ Admin-only profile editing and photo upload
✓ Checkout with payment method selection
✓ Admin dashboard statistics
✓ Docker-ready backend deployment

## 🔑 Key Implementation Details

### Frontend
- **State Management**: React useState untuk local state
- **API Calls**: Axios dengan service layer pattern
- **Routing**: React Router DOM v7
- **Styling**: Pure CSS dengan responsive grid layouts
- **Components**: Functional components dengan hooks
- **User ID**: Hardcoded sebagai 1 untuk demo (seharusnya dari auth)

### Backend
- **Database**: MySQL dengan mysql2 library
- **Controllers**: Business logic separation
- **Routes**: Modular routing structure
- **Error Handling**: Try-catch dan status code management
- **CORS**: Konfigurasi untuk localhost:5173 dan 3000

## 🚀 Deployment

### Docker
```bash
cd express
docker build -t carimakan-backend .
docker run -p 5000:5000 carimakan-backend
```

### Render / PaaS
- Gunakan file [render.yaml](render.yaml) sebagai konfigurasi deployment
- Pastikan variabel environment database sudah diset

## 🎯 Testing

### Test Backend
1. Pastikan backend running di port 5000
2. Test endpoint dengan Postman atau cURL:
```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/foods
```

### Test Frontend
1. Pastikan backend dan frontend running
2. Akses `http://localhost:5173`
3. Test fitur:
   - Search makanan
   - Click detail makanan
   - Tambah ke favorit
   - Lihat reviews
   - Buat order

## 📝 Notes

- User ID saat ini di-hardcode sebagai `1`. Untuk production, implement authentication terlebih dahulu.
- Database credentials di `.env` file
- CORS dikonfigurasi untuk localhost development
- CSS tidak menggunakan Tailwind, menggunakan CSS biasa untuk full control
- Semua API responses menggunakan JSON format

## 🐛 Troubleshooting

### Backend
- **Database connection error**: Pastikan MySQL running dan credentials benar
- **Port 5000 already in use**: Ubah PORT di `.env` file
- **Module not found**: Pastikan sudah `npm install`

### Frontend
- **API call error**: Pastikan backend running di port 5000
- **Components not showing**: Check browser console untuk error
- **CORS error**: Pastikan CORS configuration di backend benar

## 📄 License

MIT

## 👥 Author

Created for CariMakan Project
