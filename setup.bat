@echo off

REM CariMakan - Quick Start Script for Windows

echo 🍽️  CariMakan - Aplikasi Food Ordering
echo ======================================
echo.

REM Check if we're in the right directory
if not exist "express" (
    echo ❌ Error: Jalankan script ini dari folder project-kelompok
    exit /b 1
)

if not exist "react" (
    echo ❌ Error: Jalankan script ini dari folder project-kelompok
    exit /b 1
)

echo 📦 Installing Backend Dependencies...
cd express
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    exit /b 1
)
echo ✅ Backend dependencies installed

echo.
echo 📦 Installing Frontend Dependencies...
cd ..\react
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    exit /b 1
)
echo ✅ Frontend dependencies installed

echo.
echo ✅ Setup Complete!
echo.
echo 🚀 Untuk menjalankan aplikasi:
echo.
echo Terminal 1 - Backend:
echo   cd express
echo   npm run dev
echo.
echo Terminal 2 - Frontend:
echo   cd react
echo   npm run dev
echo.
echo Frontend akan berjalan di: http://localhost:5173
echo Backend API akan berjalan di: http://localhost:5000
echo.
echo 📝 Pastikan MySQL database 'carimakan_db' sudah ada!
echo.

pause
