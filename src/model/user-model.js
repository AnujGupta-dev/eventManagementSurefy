const { pool } = require('../config/db');

const createUser = async (name, email) => {
  const user = await getUserByEmail(email);

  if (user) {
    throw new Error('Email already exists');
  }

  const result = await pool.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [name, email]
  );
  return result.rows[0];
};

const getUserById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
};