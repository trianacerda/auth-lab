const { Router } = require('express');
const UserServices = require('../services/usersService');

module.exports = Router().post('/sign-up', async (req, res, next) => {
  try {
    const userInfo = await UserServices.createUser(req.body);
    res.send(userInfo);
  } catch (error) {
    next(error);
  }
});

// .post('/', (req, res, next) => {

// })
// .get('/', (req, res, next) => {

// });
