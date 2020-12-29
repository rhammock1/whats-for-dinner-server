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
protectedRouter
  .route('/:user_id/recipes')
  .get(requireAuth, (req, res, next) => {
    protectedService.getUsersRecipes(req.app.get('db'), req.params.user_id)
    .then(recipes => res.status(200).json(recipes))
    
  })
protectedRouter
  .route('/:user_id/favorites')
  .get(requireAuth, (req, res, next) => {
    protectedService.getUsersFavorites(req.app.get('db'), req.params.user_id)
    .then(favorites => res.json(favorites.map(protectedService.serializeThing)))
    
  })
module.exports = protectedRouter;