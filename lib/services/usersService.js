const Users = require('../models/Users');
const bcrypt = require('bcryptjs');

module.exports = class UserServices {
  static async createUser({ email, password }) {
    const userExists = await Users.findByEM(email);

    if (userExists) {
      throw new Error('User exists, please sign up with a different email');
    }

    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await Users.insert({
      email,
      passwordHash,
    });
    return user;
  }
};
