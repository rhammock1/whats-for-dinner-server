const express = require('express');
const path = require('path');
const protectedService = require('./protected-services');
const xss = require('xss');
const protectedRouter = express.Router();
const jsonParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');

protectedRouter
  .route('/:user_id/restaurants')
  .get(requireAuth, (req, res, next) => {
    protectedService.getUsersRestaurants(req.app.get('db'), req.params.user_id)
    .then(restaurants => res.status(200).json(restaurants))
    
  })

module.exports = protectedRouter;