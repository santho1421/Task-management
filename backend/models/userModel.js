const { pool } = require('../config/db');

/**
 * User Model: Handles MySQL queries for the 'users' table
 */
const userModel = {
  // Find a user by email address
  findByEmail: async (email) => {
    const [rows] = await pool.query(
      'SELECT id, name, email, password, created_at FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  // Find a user by primary key ID (omits password)
  findById: async (id) => {
    const [rows] = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  // Insert a new user record
  create: async ({ name, email, password }) => {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    return {
      id: result.insertId,
      name,
      email,
    };
  },
};

module.exports = userModel;
