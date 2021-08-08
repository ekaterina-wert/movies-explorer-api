const Movie = require('../models/movie');
const { OK } = require('../utils/constants');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const BadRequestError = require('../errors/bad-request-error');

// Получить список сохраненных фильмов
const getMovies = (req, res, next) => Movie.find({})
  .then((movies) => res.status(OK).send(movies))
  .catch(next);

// Добавить новый фильм
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  } = req.body;

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(OK).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при сохранении фильма'));
      } else {
        next(err);
      }
    });
};

// Удалить сохраненный фильм
const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  return Movie.findById(movieId)
    .then((movie) => {
      if (!movie) throw new NotFoundError('Фильм с указанным _id не найден');

      const ifOwner = JSON.stringify(req.user._id) === JSON.stringify(movie.owner);

      if (!ifOwner) throw new ForbiddenError('Вы не можете удалять чужие фильмы');
      return movie.remove()
        .then(() => res.status(OK).send({ message: 'Фильм успешно удален' }));
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
