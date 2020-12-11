
function makeRestaurantsArray() {
  return [
    {
      id: 1,
      title: 'test-restaurant-1',
      phone_number: '(222)222-222',
      web_url: 'https://www.google.com',
      style: 'local',
      restaurant_address: '123 Easy st, Main, YT 12345',
    },
    {
      id: 2,
      title: 'test-restaurant-2',
      phone_number: '(222)222-222',
      web_url: 'https://www.google.com',
      style: 'chain',
      restaurant_address: '123 Easy st, Main, YT 12345',
    },
    {
      id: 3,
      title: 'test-resttaurant-3',
      phone_number: '(222)222-222',
      web_url: 'https://www.google.com',
      style: 'local',
      restaurant_address: '123 Easy st, Main, YT 12345',
    }
  ]
};

function makeRecipesArray() {
  return [
    {
      id: 1,
      title: 'Test recipe1',
      content: 'TEST content',
    },
    {
      id: 2,
      title: 'Test recipe2',
      content: 'TEST content'
    },
    {
      id: 2,
      title: 'Test recipe3',
      content: 'TEST content'
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
      recipe_ingredients
      RESTART IDENTITY CASCADE`
  )
}

function makeThingsFixtures() {
  const testRestaurants = makeRestaurantsArray()
  const testRecipes = makeRecipesArray()
  const testIngredients = makeIngredientsArray()
  return { testRestaurants, testRecipes, testIngredients }

}

function makeMaliciousRestaurant() {
  const maliciousRestaurant = {
    id: 911,
    title: 'TNaughty naughty very naughty <script>alert("xss");</script>',
    phone_number: 'PNaughty naughty very naughty <script>alert("xss");</script>',
    web_url: 'WNaughty naughty very naughty <script>alert("xss");</script>',
    style: 'local',
    restaurant_address: 'RNaughty naughty very naughty <script>alert("xss");</script>',
    
  }
  const expectedRestaurant = {
    id: 911,
    title: 'TNaughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    phone_number: 'PNaughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    web_url: 'WNaughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    style: 'local',
    restaurant_address: 'RNaughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    
  }
  return {
    maliciousRestaurant,
    expectedRestaurant,
  }
}

module.exports = {
  cleanTables,
  makeThingsFixtures,
  makeMaliciousRestaurant
}
