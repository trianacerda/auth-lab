const pool = require('../utils/pool');
const jwt = require('jsonwebtoken');
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
    this.role = row.role;
  }

  static async insert({ email, passwordHash, title }) {
    const role = await Role.findByTitle(title);
    const { rows } = await pool.query(
      'INSERT INTO users (email, password_hash, role_id) VALUES ($1,$2) RETURNING *',
      [email, passwordHash, title]
    );

    return new Users({ ...rows[0], role: role.title });
  }

  static async findByEM(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (rows.length === 0) return null;

    const role = await Role.findById(rows[0].role_id);

    return new Users({ ...rows[0], role: role.title });
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
