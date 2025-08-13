const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * @desc Register a new user
 * @route POST /api/users/signup
 */
exports.register = async (req, res) => {
  const { name, email, address, password, role } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    // Check if user already exists
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Allowed roles
    const allowedRoles = ["USER", "OWNER", "ADMIN"];
    const finalRole = allowedRoles.includes(role?.toUpperCase())
      ? role.toUpperCase()
      : "USER";

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    await pool.query(
      "INSERT INTO users (name, email, address, password_hash, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, address || null, hashedPassword, finalRole]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register Error:", err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc Login a user
 * @route POST /api/users/login
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (!rows.length) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    // Compare with password_hash column
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    console.error("Login Error:", err.message, err.stack);
    res.status(500).json({ error: "Server error during login" });
  }
};

/**
 * @desc Update user password
 * @route PUT /api/users/update-password
 */
exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update in DB
    await pool.query(
      "UPDATE users SET password_hash = ? WHERE id = ?",
      [hashedPassword, req.user.id]
    );

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Update Password Error:", err.message, err.stack);
    res.status(500).json({ error: "Server error during password update" });
  }
};
