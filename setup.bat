@echo off
REM Setup script for Shelter Donation Inventory System (Windows)
REM This script automates the installation and setup process

echo 🚀 Setting up Shelter Donation Inventory System...
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js version 14 or higher first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% lss 14 (
    echo ❌ Node.js version 14 or higher is required. Current version: 
    node --version
    echo    Please update Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version detected
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm version detected
npm --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies. Please check your internet connection and try again.
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Create .env file if it doesn't exist
if not exist .env (
    echo 🔧 Creating environment configuration file...
    copy env.example .env
    echo ✅ Created .env file
    echo ⚠️  Please edit .env file with your MongoDB connection string
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Setup completed successfully!
echo ==================================================
echo Next steps:
echo 1. Edit .env file with your MongoDB connection string
echo 2. Start MongoDB service (if using local MongoDB)
echo 3. Run 'npm start' to start the application
echo 4. Open http://localhost:3000 in your browser
echo.
echo For MongoDB Atlas setup:
echo 1. Go to https://www.mongodb.com/atlas
echo 2. Create free account and cluster
echo 3. Get connection string and update .env file
echo.
echo Happy coding! 🚀
pause
