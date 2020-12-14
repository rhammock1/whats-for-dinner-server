const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Recipes endpoint', function() {
  let db;

  const {
    testRecipes,
    testIngredients
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

  describe('GET /api/recipes', () => {
    context('Given there are no recipes', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/recipes')
          .expect(200, [])
      })
    })
  })

})