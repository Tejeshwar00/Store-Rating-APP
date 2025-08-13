const UserModel = {
  createUser: `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`,
  findByEmail: `SELECT * FROM users WHERE email = ?`,
  findAll: `SELECT id, name, email, address, role FROM users`,
  findById: `SELECT id, name, email, address, role FROM users WHERE id = ?`,
  updateUserRole: `UPDATE users SET role = ? WHERE id = ?`
};

module.exports = UserModel;
