const { Router } = require('express');
const UserServices = require('../services/usersService');
const Users = require('../models/Users');
const ensureAuth = require('../middleware/ensure-auth');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/sign-up', async (req, res, next) => {
    try {
      const userInfo = await UserServices.createUser({
        ...req.body,
        roleTitle: 'USER',
      });

      res.cookie('session', userInfo.authToken(), {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
      });

      res.send(userInfo);
    } catch (error) {
      error.status = 400;
      next(error);
    }
  })
  .post('/login', async (req, res, next) => {
    try {
      const user = await UserServices.auth(req.body);

      res.cookie('session', user.authToken(), {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
      });

      res.send(user);
    } catch (error) {
      error.status = 401;
      next(error);
    }
  })
  .get('/me', ensureAuth, async (req, res, next) => {
    try {
      await Users.getMe(req.user);
      res.send(req.user);
    } catch (error) {
      next(error);
    }
  });
