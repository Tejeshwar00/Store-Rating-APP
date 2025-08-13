const pool = require("../config/db");

/**
 * @desc Add a new store
 * @route POST /api/stores
 * @access Admin only
 */
exports.addStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;

  try {
    if (!name || !email || !address) {
      return res.status(400).json({ message: "Name, email, and address are required" });
    }

    await pool.query(
      "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
      [name, email, address, owner_id || null]
    );

    res.status(201).json({ message: "Store added successfully" });
  } catch (err) {
    console.error("Add Store Error:", err);
    res.status(500).json({ message: "Server error while adding store" });
  }
};

/**
 * @desc Get all stores with average ratings
 * @route GET /api/stores
 * @access Authenticated users
 */
exports.getStores = async (req, res) => {
  try {
    const [stores] = await pool.query(`
      SELECT s.id, s.name, s.email, s.address,
             ROUND(AVG(r.rating), 2) AS average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
    `);

    res.json(stores);
  } catch (err) {
    console.error("Get Stores Error:", err);
    res.status(500).json({ message: "Server error while fetching stores" });
  }
};
