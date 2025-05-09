const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

const connectToDb = require('./config/db'); // Assuming you have a db config file for MongoDB

const app = express();
const cookieParser = require('cookie-parser');
// Connect to the database
connectToDb(); // Ensure your database connection is correctly established

// Import routers
const userRouter = require('./routes/user.routes.js');
const indexRouter = require('./routes/index.routes.js');

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set views folder for EJS templates

// Middleware to parse incoming form data and JSON
app.use(express.urlencoded({ extended: true })); // Middleware for parsing form data
app.use(express.json()); // Middleware for parsing JSON requests
app.use(cookieParser());

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use routers
app.use('/', indexRouter);
app.use('/user', userRouter);

// Start the server and listen on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
