const express = require('express');
const router = express.Router();
const { register, login, verifyToken } = require('../controllers/authController');

// Input validation middleware
const validateRegistration = (req, res, next) => {
    const { username, email, password } = req.body;
    const errors = {};

    // Check required fields
    if (!username) errors.username = 'Username is required';
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';

    // Additional validation
    if (username && (username.length < 3 || username.length > 30)) {
        errors.username = 'Username must be between 3 and 30 characters';
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Invalid email format';
    }

    if (password && password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: 'Validation failed',
            errors
        });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = {};

    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Invalid email format';
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: 'Validation failed',
            errors
        });
    }

    next();
};

// Routes
// POST /api/auth/register - Register a new user
router.post('/register', validateRegistration, register);

// POST /api/auth/login - Login user
router.post('/login', validateLogin, login);

// GET /api/auth/profile - Get user profile (protected route)
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile retrieved successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Server error occurred' });
    }
});

// PUT /api/auth/profile - Update user profile (protected route)
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { username } = req.body;
        const userId = req.user.id;

        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        if (username.length < 3 || username.length > 30) {
            return res.status(400).json({ 
                message: 'Username must be between 3 and 30 characters' 
            });
        }

        const db = require('../config/database');
        
        // Check if username is already taken by another user
        const [existingUsers] = await db.execute(
            'SELECT id FROM users WHERE username = ? AND id != ?',
            [username, userId]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ 
                message: 'Username is already taken' 
            });
        }

        // Update username
        await db.execute(
            'UPDATE users SET username = ?, updated_at = NOW() WHERE id = ?',
            [username, userId]
        );

        // Get updated user data
        const User = require('../models/User');
        const updatedUser = await User.findById(userId);

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email
            }
        });

    } catch (error) {
        console.error('Profile update error:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
                message: 'Username is already taken' 
            });
        }
        
        res.status(500).json({ message: 'Server error occurred' });
    }
});

// POST /api/auth/verify-token - Verify if token is valid
router.post('/verify-token', verifyToken, (req, res) => {
    res.json({
        message: 'Token is valid',
        user: {
            id: req.user.id,
            username: req.user.username,
            type: req.user.type
        }
    });
});

// POST /api/auth/logout - Logout user (client-side token removal)
router.post('/logout', verifyToken, (req, res) => {
    // Since we're using JWT tokens, logout is handled client-side
    // This endpoint just confirms the user was authenticated
    res.json({
        message: 'Logged out successfully'
    });
});

module.exports = router;