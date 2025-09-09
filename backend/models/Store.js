const db = require('../config/database');

class Store {
    static async getAll() {
        const [rows] = await db.execute(`
            SELECT s.*, 
                   AVG(r.rating) as average_rating, 
                   COUNT(r.id) as review_count
            FROM stores s 
            LEFT JOIN reviews r ON s.id = r.store_id 
            GROUP BY s.id
        `);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.execute(`
            SELECT s.*, 
                   AVG(r.rating) as average_rating, 
                   COUNT(r.id) as review_count
            FROM stores s 
            LEFT JOIN reviews r ON s.id = r.store_id 
            WHERE s.id = ?
            GROUP BY s.id
        `, [id]);
        return rows[0];
    }

    static async create(storeData) {
        const { name, description, address, category, image_url } = storeData;
        const [result] = await db.execute(
            'INSERT INTO stores (name, description, address, category, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, description, address, category, image_url]
        );
        return result.insertId;
    }
}

module.exports = Store;