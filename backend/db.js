// db.js
const { Pool } = require('pg');
const pool = new Pool({
  user: 'admin',        // Database username
  host: 'localhost',    // Database host
  database: 'projectdb',// Database name
  password: 'admin',    // Database password
  port: 5432,           // Default PostgreSQL port
});

module.exports = pool;
