DROP TYPE IF EXISTS restaurant_style;
CREATE TYPE restaurant_style AS ENUM (
  'local',
  'chain'
);

ALTER TABLE dinner_restaurants
  ADD COLUMN
    style restaurant_style;