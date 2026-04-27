const { Pool } = require("pg");

const pool = new Pool({
  user: "admin",          // your pg username
  host: "localhost",
  database: "travel_story",  // your database name
  password: "admin123", // your pg password
  port: 5432,
});

module.exports = pool;