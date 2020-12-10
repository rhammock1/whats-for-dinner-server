
function makeRestaurantsArray() {
  return [
    {
      id: 1,
      title: 'test-restaurant-1',
      phone_number: '(222)222-222',
      web_url: 'https://www.google.com',
      style: 'password',
      restaurant_address: '123 Easy st, Main, YT 12345',
    },
    {
      id: 2,
      title: 'test-restaurant-2',
      phone_number: '(222)222-222',
      web_url: 'https://www.google.com',
      style: 'password',
      restaurant_address: '123 Easy st, Main, YT 12345',
    },
    {
      id: 3,
      title: 'test-resttaurant-3',
      phone_number: '(222)222-222',
      web_url: 'https://www.google.com',
      style: 'password',
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

module.exports = {
  cleanTables,
  makeThingsFixtures
}
