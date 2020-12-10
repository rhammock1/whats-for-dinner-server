const express = require('express');
const path = require('path');
const restaurantsService = require('./restaurants-service');
const xss = require('xss');
const restaurantsRouter = express.Router();
const jsonParser = express.json();


const serializeRestaurant = function(restaurant) {
  return {
  id: restaurant.id,
  title: xss(restaurant.title),
  phone_number: xss(restaurant.phone_number),
  web_url: xss(restaurant.web_url),
  style: restaurant.style,
  restaurant_address: xss(restaurant.restaurant_address),
  }
}

restaurantsRouter
  .route('/')
  .get((req, res, next) => {
    const db = req.app.get('db')
    restaurantsService.getAllRestaurants(db)
      .then(restaurants => {
        res.json(restaurants.map(serializeRestaurant))
      })
      .catch(next)
  })

module.exports = restaurantsRouter;