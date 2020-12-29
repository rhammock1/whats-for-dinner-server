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
  .all(requireAuth)
  .get((req, res, next) => {
    protectedService.getUsersThings(req.app.get('db'), req.params.user_id, restaurants)
    .then(restaurants => {
      res.json(restaurants.map(protectedService.serializeThing))})
    .catch(next)
  })
  // .post(jsonParser, (req, res, next) => {
  //   const { title, content } = req.body;
  //   const newRecipe = { title, content };
   
  //   for(const [key, value] of Object.entries(newRecipe)) {
  //     if(value == null) {
  //       return res.status(400).json({
  //         error: `Missing '${key}' in body`
  //       })
  //     }
  //   }
    
  //   const db = req.app.get('db');
  //   recipesService.insertRecipe(
  //     db,
  //     recipesService.serializeRecipe(newRecipe)
  //   )
  //   .then(recipe => {
  //     res.status(201)
  //       .location(path.posix.join(req.originalUrl, `/${recipe.id}`))
  //       .json(recipe)
  //   })
  //   .catch(next)
  // })

protectedRouter
  .route('/:user_id/recipes')
  .all(requireAuth)
  .get((req, res, next) => {
    protectedService.getUsersThings(req.app.get('db'), req.params.user_id, recipes)
    .then(recipes => res.json(recipes.map(protectedService.serializeThing)))
    .catch(next)
  })

protectedRouter
  .route('/:user_id/favorites')
  .all(requireAuth)
  .get((req, res, next) => {
    protectedService.getUsersThings(req.app.get('db'), req.params.user_id, favorites)
    .then(favorites => {
      
      res.json(favorites.map(protectedService.serializeThing))})
    .catch(next)
  })

module.exports = protectedRouter;