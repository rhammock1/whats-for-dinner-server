ALTER TABLE dinner_restaurants
  DROP COLUMN IF EXISTS
    style;

DROP TYPE IF EXISTS restaurant_style;