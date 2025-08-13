module.exports = {
  addRating: `INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)`,
  updateRating: `UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?`,
  getUserRating: `SELECT rating FROM ratings WHERE user_id = ? AND store_id = ?`,
};
