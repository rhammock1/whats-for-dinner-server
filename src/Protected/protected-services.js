const protectedService = {
  getUsersThings(knex, user_id, table) {
    return knex
      .select('*')
      .from(table)
      .where({user_id})
  },
  serializeThing(thing) {
    if(thing.what_it_is === 'restaurant' || thing.hasOwnProperty('style')) {
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
  insertThing(knex, newThing, table) {
  return knex
    .insert(newThing)
    .into(table)
    .returning('*')
    .then(rows => {
      return rows[0]
    })
  },
  getById(knex, id, table) {
    return knex
      .from(table)
      .select('*')
      .where('id', id)
      .first()
  },
    deleteThing(knex, id, table) {
    return knex(table)
      .where({ id })
      .delete()
  },
  updateThing(knex, id, newThingField) {
    return knex(table)
      .where({ id })
      .update(newThingField)
  },
}

module.exports = protectedService;