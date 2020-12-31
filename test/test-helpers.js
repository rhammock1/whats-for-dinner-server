const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


function makeRestaurantsArray() {
  return [
    {
      id: 1,
      title: 'test-restaurant-1',
      phone_number: '(222)222-222',
      web_url: 'https://www.google.com',
      style: 'local',
      restaurant_address: '123 Easy st, Main, YT 12345',
      user_id: 1,
    },
    {
      id: 2,
      title: 'test-restaurant-2',
      phone_number: '(222)222-222',
      web_url: 'https://www.google.com',
      style: 'chain',
      restaurant_address: '123 Easy st, Main, YT 12345',
      user_id: 1,
    },
    {
      id: 3,
      title: 'test-resttaurant-3',
      phone_number: '(222)222-222',
      web_url: 'https://www.google.com',
      style: 'local',
      restaurant_address: '123 Easy st, Main, YT 12345',
      user_id: 1,
    }
  ]
};

function makeRecipesArray() {
  return [
    {
      id: 1,
      title: 'Test recipe1',
      content: 'TEST content',
      user_id: 1,
    },
    {
      id: 2,
      title: 'Test recipe2',
      content: 'TEST content',
      user_id: 1,
    },
    {
      id: 3,
      title: 'Test recipe3',
      content: 'TEST content',
      user_id: 1,
    },
  ]
};

function makeIngredientsArray() {
  return [
    {
      id: 1,
      recipe_id: 1,
      ingredient: 'Squash',
      unit: 'cup',
      amount: '2'
    },
    {
      id: 2,
      recipe_id: 2,
      ingredient: 'Squash',
      unit: 'cup',
      amount: '2'
    },
    {
      id: 3,
      recipe_id: 3,
      ingredient: 'Squash',
      unit: 'cup',
      amount: '2'
    },
    {
      id: 4,
      recipe_id: 1,
      ingredient: 'Squash',
      unit: 'cup',
      amount: '2'
    },
    {
      id: 5,
      recipe_id: 2,
      ingredient: 'Squash',
      unit: 'cup',
      amount: '2'
    },
    {
      id: 6,
      recipe_id: 3,
      ingredient: 'Squash',
      unit: 'cup',
      amount: '2'
    },
  ]
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      dinner_restaurants,
      dinner_recipes,
      recipe_ingredients,
      dinner_users
      RESTART IDENTITY CASCADE`
  )
}
function makeUser() {
  const testUser =  {
      user_name: 'test-user-1',
      first_name: 'Test user 1',
      password: bcrypt.hashSync('password', 1),
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    }
    return testUser;

}

function makeThingsFixtures() {
  const testRestaurants = makeRestaurantsArray()
  const testRecipes = makeRecipesArray()
  const testIngredients = makeIngredientsArray()
  const testUser =  makeUser()
  return { testRestaurants, testRecipes, testIngredients, testUser }

}


function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

function makeMaliciousRestaurant() {
  const maliciousRestaurant = {
    id: 911,
    title: 'TNaughty naughty very naughty <script>alert("xss");</script>',
    phone_number: 'PNaughty naughty very naughty <script>alert("xss");</script>',
    web_url: 'WNaughty naughty very naughty <script>alert("xss");</script>',
    style: 'local',
    restaurant_address: 'RNaughty naughty very naughty <script>alert("xss");</script>',
    user_id: 1,
  }
  const expectedRestaurant = {
    id: 911,
    title: 'TNaughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    phone_number: 'PNaughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    web_url: 'WNaughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    style: 'local',
    restaurant_address: 'RNaughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    user_id: 1,
  }
  return {
    maliciousRestaurant,
    expectedRestaurant,
  }
}

function makeMaliciousRecipe() {
  const maliciousRecipe = {
    id: 911,
    title: 'TNaughty naughty very naughty <script>alert("xss");</script>',
    content: 'PNaughty naughty very naughty <script>alert("xss");</script>',
    user_id: 1,
  }
  const expectedRecipe = {
    id: 911,
    title: 'TNaughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    content: 'PNaughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    user_id: 1,
  }
  return {
    maliciousRecipe,
    expectedRecipe,
  }
}

function makeMaliciousIngredient() {
  const maliciousIngredient = {
    id: 911,
    recipe_id: 1,
    ingredient: 'PNaughty naughty very naughty <script>alert("xss");</script>',
    unit: 'cup',
    amount: 1,
    
  }
  const expectedIngredient = {
    id: 911,
    recipe_id: 1,
    ingredient: 'PNaughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    unit: 'cup',
    amount: 1,
  }

  return {
    maliciousIngredient,
    expectedIngredient,
  }
}

module.exports = {
  cleanTables,
  makeThingsFixtures,
  makeMaliciousRestaurant,
  makeMaliciousRecipe,
  makeMaliciousIngredient,
  makeAuthHeader
}
