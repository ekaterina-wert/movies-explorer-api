const jwt = require('jsonwebtoken');
const TokenError = require('../errors/unauthorized-error');
const ForbiddenError = require('../errors/forbidden-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = function auth(req, res, next) {
  const token = req.cookies.jwt;

  // if (!token) {
  //   throw new ForbiddenError('Необходима авторизация пользователя');
  // }

  let payload;
  try {
    // верификация токена
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'sesesecret');
  } catch (err) {
    throw new TokenError(err.message);
  }

  req.user = payload; // пейлоуд в объект запроса

  next();
};
