const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const File = require('../models/file.model');
const authenticateToken = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure multer disk storage for local file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// GET route to render registration form
router.get('/register', (req, res) => {
    res.render('register');
});

// GET route to render login form
router.get('/login', (req, res) => {
    res.render('login');
});

// GET route to render home page with upload form at /user/home
router.get('/home', (req, res) => {
    res.render('home');
});

// User registration route
router.post('/register', 
    [
        body('email').isEmail().withMessage('Invalid email format'),
        body('password').trim().isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
        body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('register', { errors: errors.array() });
        }

        const { email, username, password } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await userModel.create({
                email,
                username,
                password: hashedPassword
            });
            // Redirect to login page after successful registration
            res.redirect('/user/login');
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).render('register', { errorMessage: 'Email or username already exists' });
            }
            res.status(500).render('register', { errorMessage: "Error creating user" });
        }
    }
);

// User login route
router.post('/login',
    [
        body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
        body('password').trim().isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('login', { errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            const user = await userModel.findOne({ username });
            if (!user) {
                return res.status(400).render('login', { errorMessage: 'Invalid username or password' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).render('login', { errorMessage: 'Invalid username or password' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Send token via cookie and response
            res.cookie('token', token, { httpOnly: true });
            // Redirect to upload page after successful login
            res.redirect('/user/home');
        } catch (error) {
            res.status(500).render('login', { errorMessage: 'Error during login' });
        }
    }
);

// Example protected route
router.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: `Welcome ${req.user.username}`, user: req.user });
});

// File upload route using local storage and saving metadata
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).render('home', { errorMessage: 'No file uploaded' });
    }

    try {
        // Save file metadata to database
        await File.create({
            userId: req.user.userId,
            filename: req.file.filename,
            originalname: req.file.originalname,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        console.log(`File uploaded: ${req.file.filename}, Path: ${req.file.path}`);

        // Redirect to files list page after successful upload
        res.redirect('/user/files');
    } catch (error) {
        console.error('Error saving file metadata:', error);
        res.status(500).render('home', { errorMessage: 'Error saving file metadata' });
    }
});

// Route to list user's uploaded files
router.get('/files', authenticateToken, async (req, res) => {
    try {
        const files = await File.find({ userId: req.user.userId }).sort({ uploadDate: -1 });
        res.render('files', { files });
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ message: 'Error fetching files', error });
    }
});

module.exports = router;
