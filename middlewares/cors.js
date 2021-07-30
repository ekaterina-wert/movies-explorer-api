const allowedCors = [
  'https://wert',
  'http://wert',
  'http://localhost:3000',
];

const { DEFAULT_ALLOWED_METHODS } = require('../utils/constants');

module.exports = function cors(req, res, next) {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);

    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
      res.status(204).send();
    } else next();
  } else next();
};
