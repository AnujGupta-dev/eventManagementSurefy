const express = require('express');
const router = express.Router();
const eventController = require('../controller/event-controller');

router.post('/create', eventController.createEvent);
router.get('/:id', eventController.getEventDetails);
router.post('/:id/register', eventController.registerForEvent);
router.delete('/:id/register', eventController.cancelRegistration);
router.get('/upcoming', eventController.listUpcomingEvents);
router.get('/:id/stats', eventController.getEventStats);

module.exports = router;