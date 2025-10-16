const { pool } = require('../config/db');

const registerUserForEvent = async (userId, eventId) => {

  const eventResult = await pool.query(
    'SELECT capacity FROM events WHERE id = $1',
    [eventId]
  );

  if (eventResult.rows.length === 0) {
    throw new Error('Event not found');
  }

  const capacity = eventResult.rows[0].capacity;

  const countResult = await pool.query(
    'SELECT COUNT(*) FROM registrations WHERE event_id = $1',
    [eventId]
  );
  const count = parseInt(countResult.rows[0].count, 10);

  if (count >= capacity) {
    throw new Error('Event registration limit reached');
  }


  const result = await pool.query(
    'INSERT INTO registrations (user_id, event_id) VALUES ($1, $2) RETURNING *',
    [userId, eventId]
  );

  return { success: true, registration: result.rows[0] };
};

const cancelRegistration = async (userId, eventId) => {
  
  const result = await pool.query(
    'DELETE FROM registrations WHERE user_id = $1 AND event_id = $2 RETURNING *',
    [userId, eventId]
  );

  if (result.rows.length === 0) throw new Error('Registration not found');

  return { success: true };
};

module.exports = {
  registerUserForEvent,
  cancelRegistration,
};
