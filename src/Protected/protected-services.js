const protectedService = {
  getUsersRestaurants(knex, user_id) {
    return knex
      .select('*')
      .from('dinner_restaurants')
      .where({user_id})
  },
}

export default protectedService;