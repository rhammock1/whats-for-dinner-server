const express = require('express');
const path = require('path');
const recipesService = require('./recipes-service');
const ingredientsSerivice = require('./ingredients-service');
const { requireAuth } = require('../middleware/jwt-auth');

const recipesRouter = express.Router();
const jsonParser = express.json();



recipesRouter
  .route('/')
  .get((req, res, next) => {
    const db = req.app.get('db');
    recipesService.getAllRecipes(db)
      .then(recipes => {
        res.json(recipes.map(recipe => recipesService.serializeRecipe(recipe)))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { title, content, user_id } = req.body;
    const newRecipe = { title, content, user_id };
   
    for(const [key, value] of Object.entries(newRecipe)) {
      if(value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in body`
        })
      }
    }
    
    const db = req.app.get('db');
    recipesService.insertRecipe(
      db,
      recipesService.serializeRecipe(newRecipe)
    )
    .then(recipe => {
      res.status(201)
        .location(path.posix.join(req.originalUrl, `/${recipe.id}`))
        .json(recipe)
    })
    .catch(next)
  })

recipesRouter
  .route('/:recipeId')
  .all(checkRecipeExists)
  .get((req, res, next) => {
    ingredientsSerivice.getIngredients(
      req.app.get('db'),
      res.recipe.id
    )
      .then(ingredients => {
        
        ingredients.forEach(ingredient => ingredientsSerivice.serializeIngredient(ingredient)
        )
        
        const fullRecipe = {
          ...{ ingredients },
          ...res.recipe
        }
        res.status(200).json(fullRecipe)
      })
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { ingredients } = req.body;
    console.log(ingredients)
    
  })

//  recipesRouter
//    .route('/:recipeId/:ingredientId)
//    .post
//    .patch
//    .delete 
// 
// 
// 
// 
// 
// 
// 
// 

  async function checkRecipeExists(req, res, next) {
      try {
        const recipe = await recipesService.getById(
          req.app.get('db'),
          req.params.recipeId
        )
        if (!recipe) {
          return res.status(404).json({
            error: `Recipe doesn't exist`
          })
        }
        res.recipe = recipe
        next()
      } catch(error) {
        next(error)
      }
    }
  module.exports = recipesRouter;