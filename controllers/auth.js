const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ConflictError = require('../errors/conflict-error');
const BadRequestError = require('../errors/bad-request-error');

const { OK } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

// Создание нового пользователя
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))

    .then((user) => res.status(OK).send({
      name: user.name,
      email,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('Юзер с таким имейлом уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

// Аутентификация пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id }, // пейлоуд токена
        NODE_ENV === 'production' ? JWT_SECRET : 'sesesecret',
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'Lax',
        // sameSite: 'none',
        // secure: true,
      })
        .status(OK).send({
          _id: user._id,
          name: user.name,
          email,
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Разлогиниться
const logout = (req, res, next) => res.clearCookie('jwt', {
  httpOnly: true,
  sameSite: 'Lax',
  // sameSite: 'none',
  // secure: true,
})
  .status(OK).send({ message: 'Токен успешно удален' })
  .catch(next);

module.exports = {
  createUser,
  login,
  logout,
};
