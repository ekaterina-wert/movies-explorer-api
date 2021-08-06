const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login, logout } = require('../controllers/auth');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }),
}), login);

router.post('/signout', logout);

module.exports = router;
