# 📋 CariMakan - Project Checklist & Quick Reference

## ✅ Project Setup Checklist

### Backend Structure
- [x] `express/config/db.js` - Database connection
- [x] `express/controllers/foodController.js` - Food operations
- [x] `express/controllers/categoryController.js` - Category operations
- [x] `express/controllers/reviewController.js` - Review operations
- [x] `express/controllers/favoriteController.js` - Favorite operations
- [x] `express/controllers/orderController.js` - Order operations
- [x] `express/routes/foodRoutes.js` - Food endpoints
- [x] `express/routes/categoryRoutes.js` - Category endpoints
- [x] `express/routes/reviewRoutes.js` - Review endpoints
- [x] `express/routes/favoriteRoutes.js` - Favorite endpoints
- [x] `express/routes/orderRoutes.js` - Order endpoints
- [x] `express/server.js` - Main server file with CORS
- [x] `express/.env` - Configuration
- [x] `express/.gitignore` - Git ignore rules
- [x] `express/package.json` - Dependencies configured

### Frontend Structure
- [x] `react/src/services/api.js` - Axios API setup
- [x] `react/src/components/Header.jsx` + CSS
- [x] `react/src/components/Footer.jsx` + CSS
- [x] `react/src/components/SearchBar.jsx` + CSS
- [x] `react/src/components/FoodCard.jsx` + CSS
- [x] `react/src/components/Loading.jsx` + CSS
- [x] `react/src/pages/Home.jsx` + CSS
- [x] `react/src/pages/FoodDetail.jsx` + CSS
- [x] `react/src/pages/Favorites.jsx` + CSS
- [x] `react/src/pages/Orders.jsx` + CSS
- [x] `react/src/App.jsx` - Router configuration
- [x] `react/src/App.css` - Global styles
- [x] `react/src/index.css` - CSS reset
- [x] `react/src/main.jsx` - Entry point
- [x] `react/package.json` - Dependencies configured (Tailwind removed)

### Documentation
- [x] `README.md` - Project overview
- [x] `SETUP_GUIDE.md` - Detailed setup instructions
- [x] `QUICK_REFERENCE.md` - This file
- [x] `setup.sh` - Linux/Mac setup script
- [x] `setup.bat` - Windows setup script

### Dependencies
- [x] Backend: express, cors, mysql2, dotenv, nodemon
- [x] Frontend: react, react-dom, react-router-dom, axios

---

## 🚀 Quick Start Commands

### One-Time Setup
```bash
# Go to project root
cd project-kelompok

# Option 1: Manual setup
cd express && npm install
cd ../react && npm install

# Option 2: Using scripts
# Windows
setup.bat

# Linux/Mac
./setup.sh
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd express
npm run dev
```
Expected: `✓ CariMakan API Server Running` on Port 5000

**Terminal 2 - Frontend:**
```bash
cd react
npm run dev
```
Expected: `VITE v8.0.12 ready in 000 ms` on Port 5173

### Production Build

**Build Frontend:**
```bash
cd react
npm run build
```
Creates optimized build in `react/dist/`

**Start Production Backend:**
```bash
cd express
npm start
```

---

## 🧪 Quick Testing

### Test Backend
```bash
# Health check
curl http://localhost:5000/api/health

# Get all foods
curl http://localhost:5000/api/foods

# Get categories
curl http://localhost:5000/api/categories
```

### Test Frontend
1. Open `http://localhost:5173` in browser
2. Look for "CariMakan" header
3. Test search functionality
4. Click on a food item
5. Try adding to favorites
6. Check Orders page

---

## 📁 Important Files Quick Access

### Backend Key Files
| File | Purpose |
|------|---------|
| `express/.env` | Database credentials |
| `express/server.js` | API setup, routes mounting |
| `express/config/db.js` | MySQL connection |
| `express/controllers/*` | Business logic |
| `express/routes/*` | API endpoints |

### Frontend Key Files
| File | Purpose |
|------|---------|
| `react/src/App.jsx` | Router setup |
| `react/src/services/api.js` | API calls |
| `react/src/pages/Home.jsx` | Main page |
| `react/src/components/*` | UI components |
| `react/src/index.css` | Global styles |

---

## 🔐 Environment Configuration

### Backend `.env` (express/.env)
```env
DB_HOST=localhost          # MySQL host
DB_USER=root              # MySQL user
DB_PASSWORD=              # MySQL password (leave empty if none)
DB_NAME=carimakan_db      # Database name
DB_PORT=3306              # MySQL port
PORT=5000                 # Backend API port
NODE_ENV=development      # Environment
```

### Frontend Configuration (react/src/services/api.js)
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
// Change this if backend is on different URL
```

---

## 🎯 API Endpoints Cheat Sheet

```
FOODS
GET    /api/foods              - List all foods
GET    /api/foods/:id          - Get food detail
POST   /api/foods              - Create food
PUT    /api/foods/:id          - Update food
DELETE /api/foods/:id          - Delete food

CATEGORIES
GET    /api/categories         - List categories

REVIEWS
GET    /api/reviews/:foodId    - Get food reviews
POST   /api/reviews            - Create review

FAVORITES
GET    /api/favorites/:userId  - Get user favorites
POST   /api/favorites          - Add to favorites
DELETE /api/favorites/:userId/:foodId - Remove favorite

ORDERS
GET    /api/orders/:userId     - Get user orders
POST   /api/orders             - Create order
```

---

## 📊 Component Hierarchy

```
App
├── BrowserRouter
│   └── Routes
│       ├── Home
│       │   ├── Header
│       │   ├── SearchBar
│       │   ├── FoodCard (multiple)
│       │   └── Footer
│       ├── FoodDetail
│       │   ├── Header
│       │   ├── Food Info
│       │   ├── Reviews
│       │   ├── Order Form
│       │   └── Footer
│       ├── Favorites
│       │   ├── Header
│       │   ├── FoodCard (multiple)
│       │   └── Footer
│       └── Orders
│           ├── Header
│           ├── Order List
│           └── Footer
```

---

## 🎨 CSS Structure

```
Global Styles:
├── App.css           - Global app styles
├── index.css         - CSS reset
└── Component Styles:
    ├── Header.css
    ├── Footer.css
    ├── SearchBar.css
    ├── FoodCard.css
    ├── Loading.css
    ├── Home.css
    ├── FoodDetail.css
    ├── Favorites.css
    └── Orders.css
```

---

## 🔍 Debugging Tips

### Backend Debugging
```javascript
// Add console.log in controllers
console.log('Request:', req.query);
console.log('Body:', req.body);

// Check database queries
console.log('SQL Query:', query);
```

### Frontend Debugging
```javascript
// Browser Developer Tools (F12)
// Network tab - see API calls
// Console tab - see JavaScript errors
// React DevTools - inspect components

// In code:
console.log('State:', food);
console.error('Error:', error);
```

### Network Debugging
```bash
# Test API endpoints
curl -X GET http://localhost:5000/api/foods

# With data
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"food_id":1,"rating":5,"comment":"Enak!"}'
```

---

## 📦 NPM Commands Reference

### Backend
```bash
npm install       # Install dependencies
npm run dev       # Run with nodemon
npm start         # Run production
npm test          # Run tests (if configured)
```

### Frontend
```bash
npm install       # Install dependencies
npm run dev       # Run dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## 🌐 URLs Quick Links

| Component | URL |
|-----------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| API Health | http://localhost:5000/api/health |
| Foods Endpoint | http://localhost:5000/api/foods |
| Categories Endpoint | http://localhost:5000/api/categories |

---

## 💾 Database Quick Commands

```sql
-- Show all tables
SHOW TABLES;

-- Check foods table
SELECT * FROM foods;

-- Check favorites
SELECT * FROM favorites;

-- Check reviews
SELECT * FROM reviews;

-- Count records
SELECT COUNT(*) FROM foods;

-- Clear data (CAREFUL!)
TRUNCATE TABLE foods;
```

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Change PORT in .env or kill process |
| Database connection error | Check .env credentials |
| CORS error | Check server.js CORS config |
| Frontend blank | Check browser console for errors |
| API not responding | Verify backend is running on 5000 |
| No data showing | Check database has data |

---

## 📝 Git Commands

```bash
# Initialize (first time)
git init

# Add files
git add .

# Commit
git commit -m "Initial CariMakan project setup"

# Push
git push origin main
```

---

## ✨ Performance Tips

1. **Frontend**: Components are already optimized with hooks
2. **Backend**: Using connection pooling by default
3. **Database**: Add indexes on frequently queried columns
4. **API**: All endpoints use async/await for better performance
5. **Build**: Run `npm run build` for production frontend

---

## 📞 Support & Resources

- **React**: https://react.dev
- **Express**: https://expressjs.com
- **MySQL**: https://dev.mysql.com
- **Axios**: https://axios-http.com
- **React Router**: https://reactrouter.com

---

**Last Updated**: 2024-06-17
**Status**: Ready for Development
**Version**: 1.0.0
