const xss = require('xss');

const recipesService = {
  getAllRecipes(knex) {
    return knex.select('*').from('dinner_recipes')
  },
  insertRecipe(knex, newRecipe) {
    return knex
      .insert(newRecipe)
      .into('dinner_recipes')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex
      .from('dinner_recipes')
      .select('*')
      .where('id', id)
      .first()
  },
  deleteRecipe(knex, id) {
    return knex('dinner_recipes')
      .where({ id })
      .delete()
  },
  updateRecipe(knex, id, newRecipeField) {
    return knex('dinner_recipe')
      .where({ id })
      .update(newRecipeField)
  },
  serializeRecipe(recipe) {
  return {
    id: recipe.id,
    title: xss(recipe.title),
    content: xss(recipe.content),
    user_id: recipe.user_id
  }
}
  
  
};

module.exports = recipesService;