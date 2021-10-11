const pool = require('../utils/pool');

module.exports = class Role {
  id;
  title;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
  }

  static async findById(id) {
    const { rows } = await pool.query('SELECT * from roles WHERE id = $1', [
      id,
    ]);

    if (!rows[0]) return null;

    return new Role(rows[0]);
  }

  static async findByTitle(roleTitle) {
    const { rows } = await pool.query('SELECT * from roles WHERE id = $1', [
      roleTitle.toUpperCase(),
    ]);

    if (!rows[0]) return null;

    return new Role(rows[0]);
  }
};
