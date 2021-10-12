const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const { session } = req.cookies;
    req.user = jwt.verify(session, process.env.APP_SECRET);
    // console.log('req', req.user);
  } catch (error) {
    error.status = 401;
    next(error);
  }
};
