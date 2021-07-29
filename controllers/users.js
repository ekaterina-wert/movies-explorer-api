const User = require('../models/user');

const BadRequestError = require('../errors/bad-request-error');

const { OK } = require('../utils/constants');

// Получить список пользователей
const getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(OK).send(users))
  .catch(next);

// Перейти на страницу зарегистрированного пользователя
const getUser = (req, res, next) => User.findById(req.user._id)
  .then((user) => res.status(OK).send({ user }))
  .catch(next);

// Изменить информацию о пользователе
const updateUser = (req, res, next) => {
  const { name } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.status(OK).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadRequestError('Переданы некорректные данные'));
      next(err);
    });
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
};
