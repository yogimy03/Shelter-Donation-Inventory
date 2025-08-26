# Quick Start Guide

## Option 1: Simple Setup (Recommended for beginners)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up MongoDB
- **Option A**: Install MongoDB locally
- **Option B**: Use [MongoDB Atlas](https://www.mongodb.com/atlas) (free cloud database)

### 3. Configure Environment
```bash
cp env.example .env
```
Edit `.env` file with your MongoDB connection string.

### 4. Start the Application
```bash
npm start
```

### 5. Open Browser
Navigate to `http://localhost:3000`

---

## Option 2: Automated Setup

### On macOS/Linux:
```bash
chmod +x setup.sh
./setup.sh
```

### On Windows:
```bash
setup.bat
```

---

## Option 3: Docker (Advanced users)

### Start everything with one command:
```bash
docker-compose up -d
```

The application will be available at `http://localhost:3000`

---

## What You'll See

1. **Dashboard** with donation statistics
2. **Form** to add new donations
3. **List** of all donations with edit/delete options
4. **Responsive design** that works on all devices

## Troubleshooting

- **Port 3000 in use**: Change PORT in `.env` file
- **MongoDB connection failed**: Check your connection string
- **Dependencies missing**: Run `npm install` again

## Need Help?

Check the full [README.md](README.md) for detailed documentation.
