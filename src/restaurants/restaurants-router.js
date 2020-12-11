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
    const db = req.app.get('db');
    const { style } = req.query;
    
    if(style) {
      if(!['local', 'chain'].includes(style)) {
        return res.status(400).json({
        error: 'Style must be local or chain'
      })
      }
    }
    restaurantsService.getAllRestaurants(db)
      .then(restaurants => {
        const cleanRestaurants = restaurants.map(restaurant => serializeRestaurant(restaurant))
        const filteredRestaurants = cleanRestaurants.filter(restaurant => {
          if(!style) {
             return restaurant 
          }
          if(restaurant.style === style) {
             return restaurant
          }
        });
        console.log(filteredRestaurants)
        return res.status(200).json(filteredRestaurants)
      })
      .catch(next)
  })

module.exports = restaurantsRouter;