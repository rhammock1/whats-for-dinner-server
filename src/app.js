const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
require('dotenv').config();
const restaurantsRouter = require('./restaurants/restaurants-router');
const recipesRouter = require('./recipes/recipes-router');
const loginRouter = require('./login/login-router');
const usersRouter = require('./users/users-router');
const protectedRouter = require('./Protected/protected-router');

const app = express();

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/restaurants', restaurantsRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/dinner', protectedRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if(NODE_ENV === 'production') {
    response = { error: { message: 'Internal Server Error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
})

module.exports = app;
