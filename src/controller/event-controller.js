const eventModel = require('../model/event-model');
const registrationModel = require('../model/registration-model');

const createEvent = async (req, res) => {
  try {
    let { title, date_time, location, capacity } = req.body;

    if (capacity <= 0 || capacity > 1000) {
      return res.status(400).json({ error: 'Capacity must be between 1 and 1000' });
    }

    date_time = new Date(date_time).toISOString() ;

    const event = await eventModel.createEvent(title, date_time, location, capacity);
    res.status(200).json({ eventId: event.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getEventDetails = async (req, res) => {
  try {
    const eventId = req.params.id ;
    const event = await eventModel.getEventById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const registerForEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    await registrationModel.registerUserForEvent(userId, eventId);
    res.json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);``
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    await registrationModel.cancelRegistration(userId, eventId);
    res.json({ message: 'Registration canceled successfully' });
  } catch (err) {
    console.error(err);
    if (err.message === 'Registration not found') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const listUpcomingEvents = async (req, res) => {
  try {
    const events = await eventModel.getUpcomingEvents();
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getEventStats = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const event = await eventModel.getEventById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const registrationsCount = await eventModel.getEventRegistrationsCount(eventId);
    const remainingCapacity = event.capacity - registrationsCount;
    const percentageUsed = (registrationsCount / event.capacity) * 100;

    res.status(500).json({
      totalRegistrations: registrationsCount,
      remainingCapacity,
      percentageOfCapacityUsed: percentageUsed.toFixed(2),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createEvent,
  getEventDetails,
  registerForEvent,
  cancelRegistration,
  listUpcomingEvents,
  getEventStats,
};