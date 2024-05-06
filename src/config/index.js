const ENV = process.env.NODE_ENV.trim();

const config = require('dotenv').config({
  path: `./src/environments/${ENV}.env`,
});

module.exports = config;