const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const limiter = require('./middlewares/rate-limit');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleErrors = require('./middlewares/handle-errors');
const NotFoundError = require('./errors/not-found-error');

const { NODE_ENV, MONGO_URL, PORT = 3030 } = process.env;
const { DEV_MONGO_URL } = require('./utils/constants');

const app = express();

app.use(cors);

app.use(helmet());

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : DEV_MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(requestLogger); // подключаем логгер запросов до обработчиков роутов

app.use(limiter);

// роуты, не требующие авторизации
app.use('/', require('./routes/auth'));

// авторизация
app.use(auth);

// роуты, для которых нужна авторизации
app.use('/', require('./routes/users'));

app.use('/', require('./routes/movies'));

// Handling 404
app.use(() => {
  throw new NotFoundError('Такой страницы не существует');
});

app.use(errorLogger); // подключаем логгер ошибок после роутов и до обработчиков ошибок

// Обработка ошибок валидатора celebrate
app.use(errors());

// мидлвэр для централизованной обработки ошибок
app.use(handleErrors);

app.listen(PORT);
