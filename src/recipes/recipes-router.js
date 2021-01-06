'use strict';
const express = require('express');
const path = require('path');
const recipesService = require('./recipes-service');
const ingredientsService = require('./ingredients-service');
const { requireAuth } = require('../middleware/jwt-auth');

const recipesRouter = express.Router();
const jsonParser = express.json();



recipesRouter
  .route('/')
  .get((req, res, next) => {
    const db = req.app.get('db');
    recipesService.getAllRecipes(db)
      .then(recipes => {
        res.json(recipes.map(recipe => recipesService.serializeRecipe(recipe)));
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { title, content, user_id } = req.body;
    const newRecipe = { title, content, user_id };
   
    for(const [key, value] of Object.entries(newRecipe)) {
      if(value === null) {
        return res.status(400).json({
          error: `Missing '${key}' in body`
        });
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
          .json(recipe);
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const {recipeId} = req.headers;
    
    recipesService.deleteRecipe(
      req.app.get('db'), recipeId
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

recipesRouter
  .route('/:recipeId')
  .all(checkRecipeExists)
  .get((req, res, next) => {
    ingredientsService.getIngredients(
      req.app.get('db'),
      res.recipe.id
    )
      .then(ingredients => {
        
        ingredients.forEach(ingredient => ingredientsService.serializeIngredient(ingredient)
        );
        
        const fullRecipe = {
          ingredients,
          title: res.recipe.title,
          content: res.recipe.content,
          user_id: res.user_id,
          id: res.recipe.id,
        };
        res.status(200).json(fullRecipe);
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const ingredients = req.body;
    
    ingredients.map(ingredient => {
      for(const [key, value] of Object.entries(ingredient)) {
        if(value === null) {
          return res.status(400).json({
            error: `Missing '${key}' in body`
          });
        }
      }
      ingredientsService.serializeIngredient(ingredient);
    });
    const ingredientsToInsert = ingredients.map(ingredient => ({
      amount: ingredient.amount,
      unit: ingredient.unit,
      ingredient: ingredient.ingredient,
      recipe_id: ingredient.recipe_id
    }));
    ingredientsService.insertIngredient(req.app.get('db'), ingredientsToInsert)
      .then(ingredient => {
        return res.status(201)
          .location(path.posix.join(req.originalUrl, `/${ingredient.recipe_id}`))
          .json(ingredient);
      })
      .catch(next);
      

  })
  .delete(requireAuth, (req, res, next) => {
    const {recipeId} = req.params;
    const {ingredientId } = req.headers;
    
    if(ingredientId) {
      ingredientsService.deleteIngredient(
        req.app.get('db'), ingredientId
      )
        .then(() => {
          res.status(204).end();
        })
        .catch(next);
    } else {
      ingredientsService.deleteAllIngredients(
        req.app.get('db'), recipeId
      )
        .then(() => {
          recipesService.deleteRecipe(
            req.app.get('db'), recipeId
          )
            .then(() => {
              res.status(204).end();
            })
            .catch(next);
        })
        .catch(next);
    }
    
  
    
  });

const checkRecipeExists = (req, res, next) => {
  try {
    const recipe = recipesService.getById(
      req.app.get('db'),
      req.params.recipeId
    );
    if (!recipe) {
      return res.status(404).json({
        error: 'Recipe doesn\'t exist'
      });
    }
    res.recipe = recipe;
    next();
  } catch(error) {
    next(error);
  }
};
module.exports = recipesRouter;