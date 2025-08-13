const pool = require("../config/db");

/**
 * @desc Add or update a rating for a store
 * @route POST /api/ratings
 * @access Normal user
 */
exports.addOrUpdateRating = async (req, res) => {
  const { store_id, rating } = req.body;

  try {
    if (!store_id || !rating) {
      return res.status(400).json({ message: "Store ID and rating are required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Check if rating already exists
    const [existing] = await pool.query(
      "SELECT * FROM ratings WHERE user_id = ? AND store_id = ?",
      [req.user.id, store_id]
    );

    if (existing.length > 0) {
      await pool.query(
        "UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?",
        [rating, req.user.id, store_id]
      );
      return res.json({ message: "Rating updated successfully" });
    }

    // Insert new rating
    await pool.query(
      "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
      [req.user.id, store_id, rating]
    );

    res.json({ message: "Rating added successfully" });
  } catch (err) {
    console.error("Add/Update Rating Error:", err);
    res.status(500).json({ message: "Server error while adding/updating rating" });
  }
};

/**
 * @desc Get all ratings for a store (store owner)
 * @route GET /api/ratings/:id
 * @access Store owner
 */
exports.getStoreRatings = async (req, res) => {
  const { id } = req.params;

  try {
    const [ratings] = await pool.query(
      `SELECT u.name, r.rating
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?`,
      [id]
    );

    res.json(ratings);
  } catch (err) {
    console.error("Get Store Ratings Error:", err);
    res.status(500).json({ message: "Server error while fetching store ratings" });
  }
};
