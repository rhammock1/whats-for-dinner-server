const xss = require('xss');

const ingredientsSerivice = {
  getIngredients(knex, recipeId) {
    return knex
      .from('recipe_ingredients')
      .select('*')
      .where('recipe_id', recipeId)
  },
  insertIngredient(knex, newIngredient) {
    return knex
      .insert(newIngredient)
      .into('recipe_ingredients')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  // getById(knex, id) {
  //   return knex
  //     .from('dinner_recipes')
  //     .select('*')
  //     .where('id', id)
  //     .first()
  // },
  deleteIngredient(knex, ingredientId) {
    return knex('recipe_ingredients')
      .where({ id:ingredientId })
      .delete()
  },
  deleteAllIngredients(knex, recipe_id) {
    return knex('recipe_ingredients')
      .select('*')
      .where({ recipe_id })
      .delete()
      
  },
  updateIngredient(knex, id, newIngredientField) {
    return knex('recipe_ingredients')
      .where({ id })
      .update(newIngredientField)
  },
  serializeIngredient(ingredient) {
    return {
      id: ingredient.id,
      ingredient: xss(ingredient.ingredient),
      unit: xss(ingredient.unit),
      amount: xss(ingredient.amount),
      recipe_id: ingredient.recipe_id
    }}
};

module.exports = ingredientsSerivice;