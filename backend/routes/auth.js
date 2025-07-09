const express = require('express');
const passport = require('passport');
const db = require('../models');
const User = db.User;
const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User with that email already exists.' });
        }
        const newUser = await User.create({ email, password });
        req.login(newUser, (err) => {
            if (err) return res.status(500).json({ message: 'Session login failed after registration.' });
            res.status(201).json({ id: newUser.id, email: newUser.email });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user.', error: error.message });
    }
});

// POST /api/auth/login
router.post('/login', passport.authenticate('local'), (req, res) => {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.json({ id: req.user.id, email: req.user.email });
});

// POST /api/auth/logout
router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.status(200).json({ message: 'Logged out successfully.' });
    });
});

// GET /api/auth/status
// A protected route to check if a user is logged in.
router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ id: req.user.id, email: req.user.email });
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

module.exports = router;