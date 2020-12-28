const express = require('express');
const path = require('path');
const { hasUserWithUserName } = require('./users-service');
const UsersService = require('./users-service');
const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter
  .post( '/', jsonParser, (req, res, next) => {
    const { password, user_name, first_name } = req.body;

    for(const field of ['first_name', 'user_name', 'password']) {
      if(!req.body[field]) {
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })
      }
    }
    const userNameError = UsersService.validateUserName(user_name);
    if(userNameError) {
      return res.status(400).json({
        error: userNameError
      })
    }
    const passwordError = UsersService.validatePassword(password);
    if(passwordError) {
      return res.status(400).json({
        error: passwordError
      })
    }
    UsersService.hasUserWithUserName(
      req.app.get('db'),
      user_name
    )
      .then(hasUserWithUserName => {
        if(hasUserWithUserName) {
          return res.status(400).json({ error: `Username already taken` })
        }
        return UsersService.hashPassword(password)
          .then(hashedPasword => {
            const newUser = {
              user_name,
              password: hashedPasword,
              first_name,
              date_created: 'now()',
            }
            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res.status(201).location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(UsersService.serializeUser(user))
              })
          })
      })
      .catch(next)
  })

  module.exports = usersRouter;