const protectedService = {
  getUsersRestaurants(knex, user_id) {
    return knex
      .select('*')
      .from('dinner_restaurants')
      .where({user_id})
  },
  getUsersRecipes(knex, user_id) {
    return knex
      .select('*')
      .from('dinner_recipes')
      .where({user_id})
  },
  serializeThing(thing) {
    if(thing.what_it_is === 'restaurant') {
      return {
        id: thing.id,
        title: xss(thing.title),
        phone_number: xss(thing.phone_number),
        web_url: xss(thing.web_url),
        style: thing.style,
        restaurant_address: xss(thing.restaurant_address),
        user_id: thing.user_id,
        }
    } else {
      return {
        id: thing.id,
        title: xss(thing.title),
        content: xss(thing.content)
      }
    }
  },
}

module.exports = protectedService;