const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Restaurants Endpoints', function() {
  let db;

  const {
    testRestaurants,
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

  describe.only('GET /api/restaurants', () => {
    context('Given no restaurants', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/restaurants')
          .expect(200, [])
      })
    })
  })

})