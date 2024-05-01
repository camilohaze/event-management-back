const db = require("mysql2");
const config = require("./../config");
const {
  parsed: { HOST, PORT, USERNAME, PASSWORD, DATABASE },
} = config;
const connection = db.createConnection({
  host: HOST,
  port: PORT,
  user: USERNAME,
  password: PASSWORD,
  database: DATABASE,
});

module.exports = connection.promise();
