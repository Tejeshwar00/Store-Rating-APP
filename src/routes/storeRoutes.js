const router = require("express").Router();
const db = require("../config/db");

// GET /api/stores?search=&minRating=&page=&limit=
router.get("/", (req, res) => {
  const { search = "", minRating = 0, page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  // build WHERE for search on name/email/address
  const like = `%${search}%`;
  const where = `
    (s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?)
  `;

  const sql = `
    SELECT 
      s.id, s.name, s.email, s.address,
      COALESCE(ROUND(AVG(r.rating),1), 0) AS avgRating,
      COUNT(r.id) AS ratingCount
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    WHERE ${where}
    GROUP BY s.id
    HAVING avgRating >= ?
    ORDER BY avgRating DESC, ratingCount DESC, s.name ASC
    LIMIT ? OFFSET ?
  `;

  db.query(sql, [like, like, like, Number(minRating), Number(limit), Number(offset)], (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error", detail: err.sqlMessage });
    res.json(rows);
  });
});

module.exports = router;
