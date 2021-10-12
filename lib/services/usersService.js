const Users = require('../models/Users');
const bcrypt = require('bcryptjs');

module.exports = class UserServices {
  static async createUser({ email, password, title }) {
    // console.log('title', title);
    const userExists = await Users.findByEM(email);

    if (userExists) {
      throw new Error('User exists, please sign up with a different email');
    }

    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await Users.insert(email, passwordHash, title);
    return user;
  }

  static async auth({ email, password }) {
    const userExists = await Users.findByEM(email);
    console.log(userExists, '!!');
    if (!userExists) {
      throw new Error('wrong password/email-- try again!');
    }

    const passwordMatches = await bcrypt.compare(
      password,
      userExists.passwordHash
    );

    if (!passwordMatches) {
      throw new Error('wrong password/email-- try again!');
    }

    return userExists;
  }
};
