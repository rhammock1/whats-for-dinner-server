const express = require('express');
const path = require('path');
const protectedService = require('./protected-services');
const protectedRouter = express.Router();
const jsonParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');

const restaurants = 'dinner_restaurants';
const recipes = 'dinner_recipes';
const favorites = 'user_favorites';
protectedRouter
  .route('/:user_id/restaurants')
  .get(requireAuth, (req, res, next) => {
    protectedService.getUsersThings(req.app.get('db'), req.params.user_id, restaurants)
    .then(restaurants => res.json(protectedService.serializeThing))
    .catch(next)
  })

protectedRouter
  .route('/:user_id/recipes')
  .get(requireAuth, (req, res, next) => {
    protectedService.getUsersThings(req.app.get('db'), req.params.user_id, recipes)
    .then(recipes => res.json(protectedService.serializeThing))
    .catch(next)
  })
  
protectedRouter
  .route('/:user_id/favorites')
  .get(requireAuth, (req, res, next) => {
    protectedService.getUsersThings(req.app.get('db'), req.params.user_id, favorites)
    .then(favorites => res.json(favorites.map(protectedService.serializeThing)))
    .catch(next)
  })

module.exports = protectedRouter;