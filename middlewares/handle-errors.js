const { SERVER_ERROR } = require('../utils/constants');

module.exports = function handleErrors(err, req, res, next) {
  const { statusCode = SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message: statusCode === SERVER_ERROR
      // ? message
      ? 'На сервере произошла ошибка'
      : message,
  });
  return next();
};
