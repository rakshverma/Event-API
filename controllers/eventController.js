const Joi = require('joi');
const eventModel = require('../models/eventModel.js');
const userModel = require('../models/userModel.js');

// ✅ Validation Schema
const eventSchema = Joi.object({
  title: Joi.string().required(),
  date_time: Joi.date().iso().required(),
  location: Joi.string().required(),
  capacity: Joi.number().integer().min(1).max(1000).required()
});

exports.createEvent = async (req, res) => {
  try {
    const { error, value } = eventSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const id = await eventModel.createEvent(value);
    res.status(201).json({ eventId: id });
  } catch (err) {
      console.error(err);   
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getEventDetails = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const event = await eventModel.getEventWithRegistrations(id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: 'User ID required' });

    const event = await eventModel.getEventById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const now = new Date();
    if (new Date(event.date_time) < now) {
      return res.status(400).json({ error: 'Cannot register for past events' });
    }

    const count = await eventModel.countRegistrations(eventId);
    if (count >= event.capacity) {
      return res.status(400).json({ error: 'Event is full' });
    }

    const user = await userModel.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const registered = await eventModel.isUserRegistered(userId, eventId);
    if (registered) return res.status(400).json({ error: 'Already registered' });

    await eventModel.registerUser(userId, eventId);
    res.json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.cancelRegistration = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: 'User ID required' });

    const existing = await eventModel.isUserRegistered(userId, eventId);
    if (!existing) return res.status(400).json({ error: 'User was not registered' });

    await eventModel.cancelRegistration(userId, eventId);
    res.json({ message: 'Registration cancelled' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.listUpcomingEvents = async (req, res) => {
  try {
    const events = await eventModel.listUpcomingEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.eventStats = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const event = await eventModel.getEventById(id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const count = await eventModel.countRegistrations(id);
    const remaining = event.capacity - count;
    const percentage = (count / event.capacity * 100).toFixed(2);

    res.json({
      totalRegistrations: count,
      remainingCapacity: remaining,
      capacityUsedPercentage: `${percentage}%`
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
    