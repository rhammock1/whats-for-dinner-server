const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')


describe('Protected endpoints', function() {
  let db;
  const {
    testUser,
    testRestaurants,
    testRecipes
  } = helpers.makeThingsFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
  })
  app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))
  beforeEach('insert testUser', () => {
      return db
        .into('dinner_users')
        .insert(testUser)
    })
  beforeEach('insert testRecipes', () => {
    return db
      .into('dinner_recipes')
      .insert(testRecipes)
  })
  beforeEach('insert testRestaurants', () => {
    return db
      .into('dinner_restaurants')
      .insert(testRestaurants)
  })
  const protectedEndpoints = [
    {
      name: 'GET /api/dinner/:user_id/favorites',
      path: '/api/dinner/1/favorites',
      method: supertest(app).get,
    },
    {
      name: 'POST /api/dinner/:user_id/favorites',
      path: '/api/dinner/1/favorites',
      method: supertest(app).post,
    },
    {
      name: 'DELETE /api/dinner/:user_id/favorites',
      path: '/api/dinner/1/favorites',
      method: supertest(app).delete,
    },
    {
      name: 'POST /api/recipes',
      path: '/api/recipes',
      method: supertest(app).post,
    },
    {
      name: 'DELETE /api/recipes/:recipeId',
      path: '/api/recipes/1',
      method: supertest(app).delete,
    },
    {
      name: 'GET /api/dinner/:user_id/recipes',
      path: '/api/dinner/1/recipes',
      method: supertest(app).get,
    },
    {
      name: 'GET /api/dinner/:user_id/restaurants',
      path: '/api/dinner/1/restaurants',
      method: supertest(app).get,
    },
    {
      name: 'POST /api/restaurants',
      path: '/api/restaurants',
      method: supertest(app).post,
    },
    {
      name: 'DELETE /api/restaurants/:restaurantId',
      path: '/api/restaurants/1',
      method: supertest(app).delete,
    },
  ]

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it(`responds 401 'Missing bearer token' when no bearer token`, () => {
        return endpoint.method(endpoint.path)
          .expect(401, { error: `Missing bearer token` })
      })

      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUser
        const invalidSecret = 'bad-secret'
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: `Unauthorized request` })
      })

      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        const invalidUser = { user_name: 'user-not-existy', id: 1 }
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: `Unauthorized request` })
      })
    })
  })
})