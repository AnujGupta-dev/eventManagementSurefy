const { pool } = require('../config/db');

const createEvent = async (title, date_time, location, capacity) => {
  const result = await pool.query(
    'INSERT INTO events (title, date_time, location, capacity) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, date_time, location, capacity]
  );
  return result.rows[0];
};

const getEventById = async (eventId) => {
  const eventResult = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
  if (eventResult.rows.length === 0) {
    return null;
  }
  const event = eventResult.rows[0];
  const registrationsResult = await pool.query(
    `SELECT users.id, users.name, users.email 
     FROM users 
     INNER JOIN registrations ON users.id = registrations.user_id 
     WHERE registrations.event_id = $1`,
    [eventId]
  );
  event.registrations = registrationsResult.rows;
  return event;
};

const getUpcomingEvents = async () => {
  const result = await pool.query(
    `SELECT * FROM events 
     WHERE date_time > NOW() 
     ORDER BY date_time ASC, location ASC`
  );
  return result.rows;
};

const getEventRegistrationsCount = async (eventId) => {
  const result = await pool.query(
    'SELECT COUNT(*) FROM registrations WHERE event_id = $1',
    [eventId]
  );
  return parseInt(result.rows[0].count, 10);
};



module.exports = {
  createEvent,
  getEventById,
  getUpcomingEvents,
  getEventRegistrationsCount,
};