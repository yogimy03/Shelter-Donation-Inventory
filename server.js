// Main server file for Shelter Donation Inventory System
// This file sets up the Express server and connects to MongoDB

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Create Express app instance
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup for handling requests
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Serve static files from public directory
app.use(express.static('public'));

// MongoDB connection string - using local MongoDB or MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shelter-donations';

// Connect to MongoDB database
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Successfully connected to MongoDB database');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    console.log('Please make sure MongoDB is running or check your connection string');
});

// Import the Donation model
const Donation = require('./models/Donation');

// API Routes for donation management

// Get all donations - returns list of all donations in the system
app.get('/api/donations', async (req, res) => {
    try {
        const donations = await Donation.find().sort({ date: -1 }); // Sort by date, newest first
        res.json(donations);
    } catch (error) {
        console.error('Error fetching donations:', error);
        res.status(500).json({ message: 'Failed to fetch donations', error: error.message });
    }
});

// Get donation statistics - returns summary numbers for dashboard
app.get('/api/statistics', async (req, res) => {
    try {
        const totalDonations = await Donation.countDocuments();
        const totalMoney = await Donation.aggregate([
            { $match: { type: 'money' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        // Count donations by type
        const typeCounts = await Donation.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);
        
        // Calculate total estimated value
        const totalEstimatedValue = await Donation.aggregate([
            { $match: { estimatedValue: { $exists: true, $ne: null } } },
            { $group: { _id: null, total: { $sum: '$estimatedValue' } } }
        ]);
        
        // Convert type counts to object
        const typeStats = {};
        typeCounts.forEach(type => {
            typeStats[type._id] = type.count;
        });
        
        const stats = {
            totalDonations: totalDonations,
            totalMoney: totalMoney.length > 0 ? totalMoney[0].total : 0,
            totalEstimatedValue: totalEstimatedValue.length > 0 ? totalEstimatedValue[0].total : 0,
            typeBreakdown: {
                food: typeStats.food || 0,
                clothing: typeStats.clothing || 0,
                electronics: typeStats.electronics || 0,
                furniture: typeStats.furniture || 0,
                books: typeStats.books || 0,
                toys: typeStats.toys || 0,
                medical: typeStats.medical || 0,
                hygiene: typeStats.hygiene || 0,
                other: typeStats.other || 0
            }
        };
        
        res.json(stats);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
    }
});

// Create new donation - adds a new donation to the system
app.post('/api/donations', async (req, res) => {
    try {
        const { donorName, type, amount, estimatedValue, description, contactEmail, contactPhone, date } = req.body;
        
        // Validate required fields
        if (!donorName || !type || !amount || !date) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }
        
        // Validate description is provided for "other" type
        if (type === 'other' && !description) {
            return res.status(400).json({ message: 'Description is required for "other" type donations' });
        }
        
        // Create new donation document
        const newDonation = new Donation({
            donorName,
            type,
            amount: parseFloat(amount),
            estimatedValue: estimatedValue ? parseFloat(estimatedValue) : undefined,
            description: description || undefined,
            contactEmail: contactEmail || undefined,
            contactPhone: contactPhone || undefined,
            date: new Date(date)
        });
        
        // Save donation to database
        const savedDonation = await newDonation.save();
        res.status(201).json(savedDonation);
        
    } catch (error) {
        console.error('Error creating donation:', error);
        res.status(500).json({ message: 'Failed to create donation', error: error.message });
    }
});

// Update existing donation - modifies an existing donation record
app.put('/api/donations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { donorName, type, amount, estimatedValue, description, contactEmail, contactPhone, date } = req.body;
        
        // Validate required fields
        if (!donorName || !type || !amount || !date) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }
        
        // Validate description is provided for "other" type
        if (type === 'other' && !description) {
            return res.status(400).json({ message: 'Description is required for "other" type donations' });
        }
        
        // Find and update the donation
        const updatedDonation = await Donation.findByIdAndUpdate(
            id,
            {
                donorName,
                type,
                amount: parseFloat(amount),
                estimatedValue: estimatedValue ? parseFloat(estimatedValue) : undefined,
                description: description || undefined,
                contactEmail: contactEmail || undefined,
                contactPhone: contactPhone || undefined,
                date: new Date(date)
            },
            { new: true, runValidators: true }
        );
        
        if (!updatedDonation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        
        res.json(updatedDonation);
        
    } catch (error) {
        console.error('Error updating donation:', error);
        res.status(500).json({ message: 'Failed to update donation', error: error.message });
    }
});

// Delete donation - removes a donation from the system
app.delete('/api/donations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find and delete the donation
        const deletedDonation = await Donation.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        
        if (!deletedDonation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        
        res.json({ message: 'Donation deleted successfully', deletedDonation });
        
    } catch (error) {
        console.error('Error deleting donation:', error);
        res.status(500).json({ message: 'Failed to delete donation', error: error.message });
    }
});

// Get single donation by ID - retrieves a specific donation
app.get('/api/donations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const donation = await Donation.findById(id);
        
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        
        res.json(donation);
        
    } catch (error) {
        console.error('Error fetching donation:', error);
        res.status(500).json({ message: 'Failed to fetch donation', error: error.message });
    }
});

// Serve the main HTML page for all other routes
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start the server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Shelter Donation Inventory server is running on port ${PORT}`);
    console.log(`Open your browser and go to: http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});

