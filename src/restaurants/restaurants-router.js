const express = require('express');
const path = require('path');
const restaurantsService = require('./restaurants-service');
const xss = require('xss');
const { requireAuth } = require('../middleware/jwt-auth');
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
  user_id: restaurant.user_id,
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
        
        return res.status(200).json(filteredRestaurants)
      })
      .catch(next)
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { title, phone_number, web_url, style, restaurant_address, user_id } = req.body;
    console.log(user_id)
    if(!title) {
      return res.status(400).json({
        error: `Missing 'title' in body`
      })
    }
    if(!style) {
      return res.status(400).json({
        error: `Missing 'style' in body`
      })
    }
    if(!['local', 'chain'].includes(style)) {
      return res.status(400).json({
        error: 'Style must be "local" or "chain"'
      })
    }
    const newRestaurant = {
      title,
      phone_number,
      web_url,
      style,
      restaurant_address,
      user_id
    };
    const db = req.app.get('db');
    restaurantsService.insertRestaurant(
      db,
      newRestaurant
    )
      .then(restaurant => {
        return res.status(201)
        .location(path.posix.join(req.originalUrl, `/${restaurant.id}`))
        .json(serializeRestaurant(restaurant))
      })
      .catch(next)

  })

  restaurantsRouter
    .route('/:restaurantId')
    .all(checkRestaurantExists)
    .get((req, res, next) => {
      
      res.status(200).json(serializeRestaurant(res.restaurant))
    })
    .delete((req, res, next) => {
      const db = req.app.get('db');
      restaurantsService.deleteRestaurant(
        db, req.params.restaurantId
      )
      .then(() => {
        res.status(204).end()
      })
      .catch(next);
    })
    .patch(jsonParser, (req, res, next) => {
      const { 
        title, 
        phone_number = res.restaurant.phone_number, web_url = res.restaurant.web_url, 
        style, 
        restaurant_address = res.restaurant.restaurant_address } = req.body;
      
    if(!title) {
      return res.status(400).json({
        error: `Missing 'title' in body`
      })
    }
    if(!style) {
      return res.status(400).json({
        error: `Missing 'style' in body`
      })
    }
    if(!['local', 'chain'].includes(style)) {
      return res.status(400).json({
        error: 'Style must be "local" or "chain"'
      })
    }
    
    const updatedRestaurant = {
      title,
      phone_number,
      web_url,
      style,
      restaurant_address
    };
    const db = req.app.get('db');
    restaurantsService.updateRestaurant(
      db,
      req.params.restaurantId,
      serializeRestaurant(updatedRestaurant)
    )
      .then(() => {
        return res.status(204).end()
      })
      .catch(next)
    })

    async function checkRestaurantExists(req, res, next) {
      try {
        const restaurant = await restaurantsService.getById(
          req.app.get('db'),
          req.params.restaurantId
        )
        if (!restaurant) {
          return res.status(404).json({
            error: `Restaurant doesn't exist`
          })
        }
        res.restaurant = restaurant
        next()
      } catch(error) {
        next(error)
      }
    }



module.exports = restaurantsRouter;