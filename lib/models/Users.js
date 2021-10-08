const pool = require('../utils/pool');

module.exports = class Users {
  id;
  email;
  passwordHash;

  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.passwordHash = row.password_hash;
  }

  static async insert({ email, passwordHash }) {
    const { rows } = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1,$2) RETURNING *',
      [email, passwordHash]
    );

    return new Users(rows[0]);
  }

  static async findByEM(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (rows.length === 0) return null;

    return new Users(rows[0]);
  }

  // static async getMe(userID) {
  //   const { rows } = await pool.query('SELECT * FROM users WHERE userID = $1', [
  //     userID,
  //   ]);
  //   return new Users(rows[0]);
  // }

  filter;
  toJSON() {
    return {
      id: this.id,
      email: this.email,
    };
  }
};
