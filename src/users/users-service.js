'use strict';
const bcrypt = require('bcryptjs');
const xss = require('xss');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&])[\S]+/;

const UsersService = {
  hasUserWithUserName(db, user_name) {
    return db('dinner_users')
      .where({ user_name })
      .first()
      .then(user => !!user);
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('dinner_users')
      .returning('*')
      .then(([user]) => user);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password should be longer than 8 characters';
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if(!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      // eslint-disable-next-line quotes
      return `Password must contain one upper case, lower case, number and special character('!@#$%^&')`;
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  validateUserName(user_name) {
    if (user_name.startsWith(' ') || user_name.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    return null;
  },
  serializeUser(user) {
    return {
      id: user.id,
      first_name: xss(user.first_name),
      user_name: xss(user.user_name),
      date_created: new Date(user.date_created),
    };
  },
};

module.exports = UsersService;