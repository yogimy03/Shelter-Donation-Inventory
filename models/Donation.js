// MongoDB Schema for Donation records

const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    // Donor's name - required field for identification
    donorName: {
        type: String,
        required: [true, 'Donor name is required'],
        trim: true, // Remove whitespace from beginning and end
        minlength: [2, 'Donor name must be at least 2 characters long'],
        maxlength: [100, 'Donor name cannot exceed 100 characters']
    },
    
    // Type of donation
    type: {
        type: String,
        required: [true, 'Donation type is required'],
        enum: {
            values: ['money', 'food', 'clothing', 'electronics', 'furniture', 'books', 'toys', 'medical', 'hygiene', 'other'],
            message: 'Donation type must be one of the available options'
        }
    },
    
    // Amount or quantity of the donation
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount cannot be negative'],
        validate: {
            validator: function(value) {
                // For money donations, ensure amount is reasonable
                if (this.type === 'money' && value > 1000000) {
                    return false;
                }
                return true;
            },
            message: 'Amount seems too high for a donation'
        }
    },
    
    // Estimated value of the donation (optional)
    estimatedValue: {
        type: Number,
        min: [0, 'Estimated value cannot be negative'],
        validate: {
            validator: function(value) {
                if (value && value > 1000000) {
                    return false;
                }
                return true;
            },
            message: 'Estimated value seems too high for a donation'
        }
    },
    
    // Description for "other" type donations
    description: {
        type: String,
        required: function() {
            return this.type === 'other';
        },
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    
    // Contact email (optional)
    contactEmail: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(email) {
                if (!email) return true; // Optional field
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            },
            message: 'Please enter a valid email address'
        }
    },
    
    // Contact phone (optional)
    contactPhone: {
        type: String,
        trim: true,
        validate: {
            validator: function(phone) {
                if (!phone) return true; // Optional field
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
            },
            message: 'Please enter a valid phone number'
        }
    },
    
    // Date when the donation was made
    date: {
        type: Date,
        required: [true, 'Donation date is required'],
        default: Date.now,
        validate: {
            validator: function(value) {
                // Donation date cannot be in the future
                return value <= new Date();
            },
            message: 'Donation date cannot be in the future'
        }
    }
}, {
    // timestamps for tracking when records are created and updated
    timestamps: true,
    
    // Configure how the document should be converted to JSON
    toJSON: {
        transform: function(doc, ret) {
            // Format the date to be more readable
            if (ret.date) {
                ret.date = ret.date.toISOString().split('T')[0];
            }
            return ret;
        }
    }
});

// This will help when searching donations by type and date
donationSchema.index({ type: 1, date: -1 });

// Create a text index for searching donor names and descriptions
donationSchema.index({ donorName: 'text', description: 'text' });

// Export the model for use in other parts of the application
module.exports = mongoose.model('Donation', donationSchema);
