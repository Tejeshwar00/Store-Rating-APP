const db = require('../config/database');

class User {
    static async findById(id) {
        const [rows] = await db.execute('SELECT id, username, email FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async create(userData) {
        const { username, email, password } = userData;
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, password]
        );
        return result.insertId;
    }
}

module.exports = User;