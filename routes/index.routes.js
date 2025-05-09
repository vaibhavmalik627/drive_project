const express = require('express');
const router = express.Router();

// Home route for '/'
router.get('/', (req, res) => {
    res.render('index');
});

// Home route for '/home'
router.get('/home', (req, res) => {
    res.render('home');
});

module.exports = router;
