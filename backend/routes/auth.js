const express = require('express');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const db = require('../models');
const User = db.User;
const router = express.Router();

// Validation middleware
const validateRegistration = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const validateLogin = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

// POST /api/auth/register
router.post('/register', validateRegistration, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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
router.post('/login', validateLogin, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info.message || 'Authentication failed' });

        req.login(user, (err) => {
            if (err) return next(err);
            res.json({ id: user.id, email: user.email });
        });
    })(req, res, next);
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