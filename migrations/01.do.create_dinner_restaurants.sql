CREATE TABLE dinner_restaurants (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title TEXT NOT NULL,
  phone_number TEXT,
  web_url TEXT,
  restaurant_address TEXT 
);