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
    context(`Given an XSS attack restaurant`, () => {
     const { maliciousRestaurant, expectedRestaurant } = helpers.makeMaliciousRestaurant();

     beforeEach('insert malicious restaurant', () => {
       return db
         .into('dinner_restaurants')
         .insert([maliciousRestaurant])
     })

     it('removes XSS attack content', () => {
       return supertest(app)
         .get(`/api/restaurants`)
         .expect(200)
         .expect(res => {
           expect(res.body[0].title).to.eql(expectedRestaurant.title)
           expect(res.body[0].phone_number).to.eql(expectedRestaurant.phone_number)
           expect(res.body[0].web_url).to.eql(expectedRestaurant.web_url)
           expect(res.body[0].restaurant_address).to.eql(expectedRestaurant.restaurant_address)
           
         })
     })
    })
    context('Given there are restaurants in the database', () => {

      beforeEach('insert restaurants', () => {
        return db
          .into('dinner_restaurants')
          .insert(testRestaurants)
      })
      it('GET /api/restaurants responds with 200 and all of the restaurants', () => {
        return supertest(app)
          .get('/api/restaurants')
          .expect(200, testRestaurants)
      })
    })
  })
  })
