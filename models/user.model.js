const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Add unique validation to username
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
    },
    email: {
        type: String,
        required: true,
        unique: true, // Add unique validation to email
        trim: true,
        minlength: [5, 'Email must be at least 5 characters long'],
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long'],
    }
}, {timestamps: true}); // Add timestamps if needed

// Ensure indexes are created after schema definition
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

// Create the model
const userModel = mongoose.model('user', userSchema);

// Export the model
module.exports = userModel;



