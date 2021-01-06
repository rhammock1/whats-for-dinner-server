/* eslint-disable no-undef */
'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const AuthService = {
  getUserWithUserName(db, user_name) {
    return db('dinner_users')
      .where({ user_name })
      .first();
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },
  createJWT(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: 'HS256',
    });
  },
  verifyJWT(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256'],
    });
  },
  parseBasicToken(token) {
    return Buffer
      .from(token, 'base64')
      .toString()
      .split(':');
  },

};

module.exports = AuthService;