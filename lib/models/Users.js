const jwt = require('jsonwebtoken');
const pool = require('../utils/pool');
const Role = require('./Role');

module.exports = class Users {
  id;
  email;
  passwordHash;
  role;

  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.passwordHash = row.password_hash;
    this.role = row.role_id;
  }

  static async insert(email, passwordHash, title) {
    const role = await Role.findByTitle(title);
    const { rows } = await pool.query(
      'INSERT INTO users (email, password_hash, role_id) VALUES ($1,$2,$3) RETURNING *',
      [email, passwordHash, role.id]
    );

    return new Users({ ...rows[0], role: role.title });
  }

  static async findByEM(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (rows.length === 0) return null;

    const singleRole = await Role.findById(rows[0].role_id);

    const userRows = new Users({ ...rows[0], role: singleRole.title });

    console.log('role', userRows);
    return userRows;
  }

  static async getMe(userID) {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [
      userID,
    ]);
    return new Users(rows[0]);
  }

  authToken() {
    return jwt.sign(this.toJSON(), process.env.APP_SECRET, {
      expiresIn: '24h',
    });
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
    };
  }
};
