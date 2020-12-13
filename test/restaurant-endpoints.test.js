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

  describe('GET /api/restaurants', () => {
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
      it('GET /api/restaurants responds with 200 and a filtered list of restaurants when a style query is added', () => {
        let filteredRestaurants = testRestaurants.filter(restaurant => {
          if(restaurant.style === 'local') {
            return restaurant
          }
        })
        return supertest(app)
          .get('/api/restaurants/?style=local')
          .expect(200, filteredRestaurants)
      })
    })
  })
  describe('POST /api/restaurants', () => {
    context(`Given an XSS attack restaurant`, () => {
     const { maliciousRestaurant, expectedRestaurant } = helpers.makeMaliciousRestaurant();

     it('removes XSS attack content', () => {
       return supertest(app)
        .post('/api/restaurants')
        .send(maliciousRestaurant)
        .expect(201)
        .then(res =>
          supertest(app)
          .get(`/api/restaurants/${res.body.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql(expectedRestaurant.title)
            expect(res.body.phone_number).to.eql(expectedRestaurant.phone_number)
            expect(res.body.web_url).to.eql(expectedRestaurant.web_url)
            expect(res.body.restaurant_address).to.eql(expectedRestaurant.restaurant_address)
            
         })
        )
         
      })
    })
    
      const requiredFields = ['title', 'style'];

      requiredFields.forEach(field => {
        const newRestaurant = {
          title: 'New Restaurant',
          phone_number: '1234567',
          web_url: 'http://random.web',
          style: 'local',
          restaurant_address: '123 easy st.'
      };  

      it('responds with 400 error message when the title or style is missing', () => {
        delete newRestaurant[field]
        return supertest(app)
          .post('/api/restaurants')
          .send(newRestaurant)
          .expect(400, {
            error: `Missing '${field}' in body`
          })
        })
      })
    it('responds with 400 error message when the style !== local or chain', () => {
        const newRestaurant = {
        title: 'New Restaurant',
        phone_number: '1234567',
        web_url: 'http://random.web',
        style: 'wrong',
        restaurant_address: '123 easy st.'
      };
        return supertest(app)
          .post('/api/restaurants')
          .send(newRestaurant)
          .expect(400, {
            error: `Style must be "local" or "chain"`
    })
  })
    it('Creates a restaurant, responding with 201 and the new restaurants', () => {
      const newRestaurant = {
        title: 'New Restaurant',
        phone_number: '1234567',
        web_url: 'http://random.web',
        style: 'local',
        restaurant_address: '123 easy st.'
      }
      return supertest(app)
        .post('/api/restaurants')
        .send(newRestaurant)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(newRestaurant.title)
          expect(res.body.phone_number).to.eql(newRestaurant.phone_number)
          expect(res.body.web_url).to.eql(newRestaurant.web_url)
          expect(res.body.style).to.eql(newRestaurant.style)
          expect(res.body.restaurant_address).to.eql(newRestaurant.restaurant_address)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/restaurants/${res.body.id}`)
        })
        .then(postRes => 
          supertest(app)
            .get(`/api/restaurants/${postRes.body.id}`)
            .expect(postRes.body)
        )
    })
  })

  describe(`GET /api/restaurants/:restaurantId`, function() {
    context('Given no restaurants', () => {
      it('responds with 404', () => {
        let testId = 123456
        return supertest(app)
          .get(`/api/restaurants/${testId}`)
          .expect(404, { error: `Restaurant doesn't exist`})
      })
    })
    context('Given there are restaurants in the database', () => {

      beforeEach('insert restaurants', () => {
        return db
          .into('dinner_restaurants')
          .insert(testRestaurants)
      })
      it('GET /api/restaurants/:restaurantId responds with 200 and the restaurant', () => {
        return supertest(app)
          .get('/api/restaurants/1')
          .expect(200, testRestaurants[0])
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
         .get(`/api/restaurants/${maliciousRestaurant.id}`)
         .expect(200)
         .expect(res => {
           expect(res.body.title).to.eql(expectedRestaurant.title)
           expect(res.body.phone_number).to.eql(expectedRestaurant.phone_number)
           expect(res.body.web_url).to.eql(expectedRestaurant.web_url)
           expect(res.body.restaurant_address).to.eql(expectedRestaurant.restaurant_address)
           
         })
     })
    })
  })
  describe('DELETE /api/restaurants/:restaurantId', () => {
    context('Given no restaurants', () => {
      it('responds with 404', () => {
        const restaurantId = 123456;
        return supertest(app)
          .delete(`/api/restaurants/${restaurantId}`)
          .expect(404, { error: `Restaurant doesn't exist` })
      })
    })
    context('Given there are restaurants in the database', () => {
      beforeEach('insert restaurants', () => {
        return db
          .into('dinner_restaurants')
          .insert(testRestaurants)
      })
      it('responds with 204 and removes the restaurant', () => {
        const idToRemove = 2;
        const expectedRestaurants = testRestaurants.filter(restaurant => restaurant.id !== idToRemove)
        return supertest(app)
          .delete(`/api/restaurants/${idToRemove}`)
          .expect(204)
          .then(res => 
            supertest(app)
              .get(`/api/restaurants`)
              .expect(expectedRestaurants))
      })
    })
  })
  describe.only('PATCH /api/restaurants/:restaurantId', () => {
    context('Given no restaurants', () => {
      it('responds with 404', () => {
        const restaurantId = 123456;
        return supertest(app)
          .patch(`/api/restaurants/${restaurantId}`)
          .expect(404, { error: `Restaurant doesn't exist` })
      })
    })
    context('Given there are restaurants in the database' , () => {
      beforeEach('insert restaurants', () => {
        return db
          .into('dinner_restaurants')
          .insert(testRestaurants)
      })
      it('responds with 204 and updates the restaurant', () => {
        const idToUpdate = 2;
        const updatedRestaurant = {
        title: 'Updated Restaurant',
        phone_number: '1234567',
        web_url: 'http://random.web',
        style: 'local',
        restaurant_address: '123 easy st.'
      }
      const expectedRestaurant = {
        ...testRestaurants[idToUpdate - 1],
        ...updatedRestaurant
      }
      return supertest(app)
        .patch(`/api/restaurants/${idToUpdate}`)
        .send(updatedRestaurant)
        .expect(204)
        .then(res => 
          supertest(app)
            .get(`/api/restaurants/${idToUpdate}`)
            .expect(expectedRestaurant)
          )
      })
    it(`responds with 400 when no required fields supplied`, () => {
     const idToUpdate = 2
     return supertest(app)
       .patch(`/api/restaurants/${idToUpdate}`)
       .send({ irrelevantField: 'foo' })
       .expect(400, {
         error: {
           message: `Request body must contain at least title`
         }
       })
    })
        it(`responds with 204 when updating only a subset of fields`, () => {
      const idToUpdate = 2
      const updateRestaurant = {
        title: 'updated restautant title',
      }
      const expectedRestaurant = {
        ...testRestaurants[idToUpdate - 1],
        ...updateRestaurant
      }

      return supertest(app)
        .patch(`/api/restaurants/${idToUpdate}`)
        .send({
          ...updateRestaurant,
          fieldToIgnore: 'should not be in GET response'
        })
        .expect(204)
        .then(res =>
          supertest(app)
            .get(`/api/restaurants/${idToUpdate}`)
            .expect(expectedRestaurant)
        )
      })
    })
  })
})
