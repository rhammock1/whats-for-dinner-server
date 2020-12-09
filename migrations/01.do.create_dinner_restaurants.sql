-- CREATE TYPE restaurant_style AS ENUM (
--   'local',
--   'chain'
-- );

CREATE TABLE dinner_restaurants (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title TEXT NOT NULL,
  phone_number TEXT,
  web_url TEXT,
  address TEXT 
);