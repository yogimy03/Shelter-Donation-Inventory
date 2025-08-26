#!/bin/bash

# Setup script for Shelter Donation Inventory System
# This script automates the installation and setup process

echo "🚀 Setting up Shelter Donation Inventory System..."
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js version 14 or higher first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "❌ Node.js version 14 or higher is required. Current version: $(node -v)"
    echo "   Please update Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version $(npm -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies. Please check your internet connection and try again."
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating environment configuration file..."
    cp env.example .env
    echo "✅ Created .env file"
    echo "⚠️  Please edit .env file with your MongoDB connection string"
else
    echo "✅ .env file already exists"
fi

# Check if MongoDB is accessible
echo "🔍 Checking MongoDB connection..."
if command -v mongosh &> /dev/null; then
    echo "✅ MongoDB shell detected"
    echo "💡 Make sure MongoDB service is running"
elif command -v mongo &> /dev/null; then
    echo "✅ MongoDB shell detected (legacy version)"
    echo "💡 Make sure MongoDB service is running"
else
    echo "⚠️  MongoDB shell not found"
    echo "💡 You can use MongoDB Atlas (cloud) instead"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo "=================================================="
echo "Next steps:"
echo "1. Edit .env file with your MongoDB connection string"
echo "2. Start MongoDB service (if using local MongoDB)"
echo "3. Run 'npm start' to start the application"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "For MongoDB Atlas setup:"
echo "1. Go to https://www.mongodb.com/atlas"
echo "2. Create free account and cluster"
echo "3. Get connection string and update .env file"
echo ""
echo "Happy coding! 🚀"
