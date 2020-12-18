const dbURL = (process.env.NODE_ENV === 'development') 
    ? 'postgres://dunder_mifflin@localhost/dinner'
    : process.env.DATABASE_URL

module.exports = {
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: dbURL,
};