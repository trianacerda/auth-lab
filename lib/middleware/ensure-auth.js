module.exports = (req, res, next) => {
  const { userID } = req.cookies;

  if (!userID) {
    throw new Error('please sign in to continue--');
  }

  req.userId = userID;

  next();
};
