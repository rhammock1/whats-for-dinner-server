const express = require('express');
const path = require('path');
const recipesService = require('./recipes-service');
const ingredientsSerivice = require('./ingredients-service');
const xss = require('xss');
const recipesRouter = express.Router();
const jsonParser = express.json();

const serializeRecipe = function(recipe) {
  return {
    id: recipe.id,
    title: xss(recipe.title),
    content: xss(recipe.content)
  }
}

recipesRouter
  .route('/')
  .get((req, res, next) => {
    const db = req.app.get('db');
    recipesService.getAllRecipes(db)
      .then(recipes => {
        res.json(recipes.map(recipe => serializeRecipe(recipe)))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { title, content } = req.body;
    const newRecipe = { title, content };
   
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
      serializeRecipe(newRecipe)
    )
    .then(recipe => {
      res.status(201)
        .location(path.posix.join(req.originalUrl, `/${recipe.id}`))
        .json(recipe)
    })
    .catch(next)
  })

  module.exports = recipesRouter;