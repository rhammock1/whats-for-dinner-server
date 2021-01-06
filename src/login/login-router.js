'use strict';
const express = require('express');
const LoginService = require('./login-service');

const loginRouter = express.Router();
const jsonParser = express.json();

loginRouter
  .post('/', jsonParser, (req, res, next) => {
    const { user_name, password } = req.body;
    const loginUser = { user_name, password };

    for(const [key, value] of Object.entries(loginUser)) {
      if (value === undefined) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });
      }
    }

    LoginService.getUserWithUserName(
      req.app.get('db'),
      loginUser.user_name
    )
      .then(dbUser => {
        if(!dbUser) {
          return res.status(400).json({
            error: 'Incorrect user_name or password',
          });
        }
        return LoginService.comparePasswords(loginUser.password, dbUser.password)
          .then(compareMatch => {
            if(!compareMatch) {
              return res.status(400).json({
                error: 'Incorrect user_name or password',
              });

            }
            const sub = dbUser.user_name;
            const payload = { user_id:dbUser.id };
          
            res.send({
              authToken: LoginService.createJWT(sub, payload),
              user_name: dbUser.user_name,
              id: dbUser.id,
            });
          });
      })
      .catch(next);
  });

module.exports = loginRouter;