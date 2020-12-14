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
  deleteIngredient(knex, id) {
    return knex('recipe_ingredients')
      .where({ id })
      .delete()
  },
  updateIngredient(knex, id, newIngredientField) {
    return knex('recipe_ingredients')
      .where({ id })
      .update(newIngredientField)
  },
};

module.exports = ingredientsSerivice;