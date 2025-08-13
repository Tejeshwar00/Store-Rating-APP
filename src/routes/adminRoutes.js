// src/routes/adminRoutes.js
const router = require("express").Router();
const db = require("../config/db");
const { verifyToken, isAdmin } = require("../middlewares/auth");

// Middleware to ensure only admins can access
router.get("/dashboard-counts", verifyToken, isAdmin, async (req, res) => {
  try {
    const queries = {
      users: "SELECT COUNT(*) AS count FROM users",
      stores: "SELECT COUNT(*) AS count FROM stores",
      ratings: "SELECT COUNT(*) AS count FROM ratings",
    };

    const results = {};
    await new Promise((resolve, reject) => {
      db.query(queries.users, (err, rows) => {
        if (err) return reject(err);
        results.users = rows[0].count;

        db.query(queries.stores, (err2, rows2) => {
          if (err2) return reject(err2);
          results.stores = rows2[0].count;

          db.query(queries.ratings, (err3, rows3) => {
            if (err3) return reject(err3);
            results.ratings = rows3[0].count;

            resolve();
          });
        });
      });
    });

    res.json(results);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
