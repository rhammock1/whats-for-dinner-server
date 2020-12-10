const restaurantsService = {
  getAllRestaurants(knex) {
    return knex.select('*').from('dinner_restaurants')
  },
  insertRestaurant(knex, newFolder) {
    return knex
      .insert(newRestaurant)
      .into('dinner_restaurants')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex
      .from('dinner_restaurants')
      .select('*')
      .where('id', id)
      .first()
  },
  deleteRestaurant(knex, id) {
    return knex('dinner_restaurants')
      .where({ id })
      .delete()
  },
  updateRestaurant(knex, id, newRestaurantId) {
    return knex('dinner_restaurants')
      .where({ id })
      .update(newRestaurantId)
  },
};

module.exports = restaurantsService;