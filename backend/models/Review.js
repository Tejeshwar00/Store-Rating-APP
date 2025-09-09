const db = require('../config/database');

class Review {
    static async getByStoreId(storeId) {
        const [rows] = await db.execute(`
            SELECT r.*, u.username 
            FROM reviews r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.store_id = ? 
            ORDER BY r.created_at DESC
        `, [storeId]);
        return rows;
    }

    static async create(reviewData) {
        const { store_id, user_id, rating, comment } = reviewData;
        const [result] = await db.execute(
            'INSERT INTO reviews (store_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
            [store_id, user_id, rating, comment]
        );
        return result.insertId;
    }

    static async checkExistingReview(storeId, userId) {
        const [rows] = await db.execute(
            'SELECT id FROM reviews WHERE store_id = ? AND user_id = ?',
            [storeId, userId]
        );
        return rows[0];
    }
}

module.exports = Review;