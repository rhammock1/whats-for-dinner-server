const xss = require('xss');

const protectedService = {
  getUsersThings(knex, user_id, table) {
    return knex
      .select('*')
      .from(table)
      .where({user_id})
  },
  serializeThing(thing) {
    if(thing.hasOwnProperty('style')) {
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
  insertNewFavorite(knex, newFavorite) {
  return knex
    .insert(newFavorite)
    .into('user_favorites')
    .returning('*')
    .then(rows => {
      return rows[0]
    })
  },
  // getById(knex, id, table) {
  //   return knex
  //     .from(table)
  //     .select('*')
  //     .where('id', id)
  //     .first()
  // },
  //   deleteThing(knex, id, table) {
  //   return knex(table)
  //     .where({ id })
  //     .delete()
  // },
  // updateThing(knex, id, newThingField) {
  //   return knex(table)
  //     .where({ id })
  //     .update(newThingField)
  // },
}

module.exports = protectedService;