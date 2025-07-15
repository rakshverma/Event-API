const express = require('express');
const router = express.Router();
const controller = require('../controllers/eventController.js');

router.post('/:id/register', controller.registerForEvent);
router.delete('/:id/register', controller.cancelRegistration);
router.get('/:id/stats', controller.eventStats);
router.get('/:id', controller.getEventDetails);
router.post('/', controller.createEvent);
router.get('/', controller.listUpcomingEvents);


module.exports = router;
