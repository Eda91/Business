const { Pool } = require('pg');
require('dotenv').config();

// Set up the PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Function to get user by email
const getUserByEmail = async (email) => {
  try {
    console.log('Checking if user exists for email:', email);  // Log query attempt
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      console.log('User found:', result.rows[0]);  // Log found user
      return result.rows[0];  // Returns the first matching row or undefined if not found
    }
    console.log('User not found');  // Log if no user is found
    return null;
  } catch (error) {
    console.error('Error fetching user by email:', error.message);
    throw error;  // Rethrow the error to be handled in the route
  }
};

// Function to create a new user
const createUser = async ({ name, email, password }) => {
  try {
    console.log('Creating new user with name:', name, 'and email:', email);  // Log query attempt
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, password]
    );
    console.log('New user created:', result.rows[0]);  // Log newly created user
    return result.rows[0];  // Return the newly created user
  } catch (error) {
    console.error('Error creating user:', error.message);
    throw error;  // Rethrow the error to be handled in the route
  }
};

module.exports = { getUserByEmail, createUser };
