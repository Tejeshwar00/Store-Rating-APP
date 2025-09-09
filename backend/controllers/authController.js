const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Input validation helpers
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password && password.length >= 8;
};

const validateUsername = (username) => {
    return username && username.length >= 3 && username.length <= 30;
};

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Input validation
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: 'All fields are required',
                errors: {
                    username: !username ? 'Username is required' : null,
                    email: !email ? 'Email is required' : null,
                    password: !password ? 'Password is required' : null
                }
            });
        }

        // Validate email format
        if (!validateEmail(email)) {
            return res.status(400).json({ 
                message: 'Invalid email format' 
            });
        }

        // Validate username
        if (!validateUsername(username)) {
            return res.status(400).json({ 
                message: 'Username must be between 3 and 30 characters' 
            });
        }

        // Validate password strength
        if (!validatePassword(password)) {
            return res.status(400).json({ 
                message: 'Password must be at least 8 characters long' 
            });
        }

        // Check environment variable
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET environment variable is not set');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        // Check if user exists
        const [existingUsers] = await db.execute(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ 
                message: 'User already exists with this email or username' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds for better security

        // Insert user
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())',
            [username, email, hashedPassword]
        );

        // Generate JWT (exclude sensitive info from payload)
        const token = jwt.sign(
            { 
                id: result.insertId, 
                username: username,
                type: 'user' // Add user type if you have different user roles
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: result.insertId,
                username,
                email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle specific database errors
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
                message: 'User already exists with this email or username' 
            });
        }
        
        res.status(500).json({ 
            message: 'Server error occurred during registration' 
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required' 
            });
        }

        // Validate email format
        if (!validateEmail(email)) {
            return res.status(400).json({ 
                message: 'Invalid email format' 
            });
        }

        // Check environment variable
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET environment variable is not set');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        // Find user
        const [users] = await db.execute(
            'SELECT id, username, email, password FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ // Changed to 401 for authentication failure
                message: 'Invalid email or password' 
            });
        }

        const user = users[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ // Changed to 401 for authentication failure
                message: 'Invalid email or password' 
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username,
                type: 'user'
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Update last login time (optional)
        await db.execute(
            'UPDATE users SET last_login = NOW() WHERE id = ?',
            [user.id]
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Server error occurred during login' 
        });
    }
};

// Optional: Add a token verification middleware
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = {
    register,
    login,
    verifyToken
};