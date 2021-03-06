DROP TYPE IF EXISTS rest_or_reci;
CREATE TYPE rest_or_reci AS ENUM (
  'restaurant',
  'recipe'
);

CREATE TABLE user_favorites (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  what_it_is rest_or_reci,
  user_id INTEGER REFERENCES dinner_users(id) NOT NULL,
  item_id INTEGER NOT NULL
);