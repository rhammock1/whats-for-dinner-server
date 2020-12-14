const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Recipes endpoint', function() {
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
    context('Given an XSS attack recipe', () => {
      const { maliciousRecipe, expectedRecipe } = helpers.makeMaliciousRecipe();

      beforeEach('insert malicious recipe', () => {
        return db 
          .into('dinner_recipes')
          .insert(maliciousRecipe)
      })
      it('removes xss attack content', () => {
        return supertest(app)
          .get('/api/recipes')
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedRecipe.title)
           expect(res.body[0].content).to.eql(expectedRecipe.content)
          })
      })
    })
    context('Given there are recipes in the database', () => {
      beforeEach('insert Recipes', () => {
        return db 
          .into('dinner_recipes')
          .insert(testRecipes)
      })
      describe('GET /api/recipes', () => {
        it('responds with 200 and all the recipes', () => {
          return supertest(app)
            .get('/api/recipes')
            .expect(200, testRecipes)
        })
      })
    })
  })

})