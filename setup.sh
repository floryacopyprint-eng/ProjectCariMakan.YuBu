#!/bin/bash

# CariMakan - Quick Start Script

echo "🍽️  CariMakan - Aplikasi Food Ordering"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -d "express" ] || [ ! -d "react" ]; then
    echo "❌ Error: Jalankan script ini dari folder project-kelompok"
    exit 1
fi

echo "📦 Installing Backend Dependencies..."
cd express
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo ""
echo "📦 Installing Frontend Dependencies..."
cd ../react
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🚀 Untuk menjalankan aplikasi:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd express"
echo "  npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd react"
echo "  npm run dev"
echo ""
echo "Frontend akan berjalan di: http://localhost:5173"
echo "Backend API akan berjalan di: http://localhost:5000"
echo ""
echo "📝 Pastikan MySQL database 'carimakan_db' sudah ada!"
echo ""
