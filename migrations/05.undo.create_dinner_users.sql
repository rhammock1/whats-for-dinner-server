ALTER TABLE dinner_restaurants
  DROP COLUMN IF EXISTS user_id;

ALTER TABLE dinner_recipes
  DROP COLUMN IF EXISTS user_id;

DROP TABLE IF EXISTS dinner_users;