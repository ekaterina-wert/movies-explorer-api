const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

// const urlRegex = /https?:\/\/[0-9a-zA-Z\-._~:/?#[\]@!$&'()*+,;=]{2,}\.[0-9a-zA-Z\-._~:/?#[\]@!$&'()*+,;=]{2,}/;
const engRegex = /[0-9a-zA-Z\-.:/?!$&'(),;\s]{2,}/;
const ruRegex = /[0-9а-яА-Яё\-.:/?!$&'(),;\s]{2,}/;

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2),
    director: Joi.string().required().min(2),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) return value;
      return helpers.message('Передана некорректная ссылка на изображение');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) return value;
      return helpers.message('Передана некорректная ссылка на трейлер');
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) return value;
      return helpers.message('Передана некорректная ссылка на мини изображение');
    }),
    nameRU: Joi.string().required().pattern(ruRegex),
    nameEN: Joi.string().required().pattern(engRegex),
    movieId: Joi.number().required(),
  }),
}), createMovie);

router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
}), deleteMovie);

module.exports = router;
