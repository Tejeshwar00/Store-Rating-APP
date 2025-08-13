module.exports = {
  createStore: `INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`,
  getAllStores: `SELECT s.*, AVG(r.rating) as average_rating 
                 FROM stores s 
                 LEFT JOIN ratings r ON s.id = r.store_id 
                 GROUP BY s.id`,
};
