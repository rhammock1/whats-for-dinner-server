/* eslint-disable no-undef */
'use strict';
const app = require('./app');
const { PORT } = require('./config');
const MODE = process.env.NODE_ENV;
const knex = require('knex');

const pgconfig = parse(proces.env.DATABASE_URL);
pgconfig.ssl = { rejectUnauthorized: false }

const db = knex({
  client: 'pg',
  connection: (MODE === 'production') ? pgconfig : process.env.DATABASE_URL,
});

app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server running in ${MODE} mode and listening at port: ${PORT}`);
});