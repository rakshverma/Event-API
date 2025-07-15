const db = require('../db/knex.js');

async function createEvent(event) {
  const [id] = await db('events').insert(event).returning('id');
  return id;
}

async function getEventById(id) {
  return db('events')
    .where({ id })
    .first();
}

async function getEventWithRegistrations(id) {
  const event = await db('events').where({ id }).first();
  if (!event) return null;

  const users = await db('registrations')
    .join('users', 'registrations.user_id', 'users.id')
    .where('registrations.event_id', id)
    .select('users.id', 'users.name', 'users.email');

  return { ...event, registrations: users };
}

async function listUpcomingEvents() {
  return db('events')
    .where('date_time', '>', new Date())
    .orderBy([{ column: 'date_time', order: 'asc' }, { column: 'location', order: 'asc' }]);
}

async function registerUser(userId, eventId) {
  await db('registrations').insert({ user_id: userId, event_id: eventId });
}

async function isUserRegistered(userId, eventId) {
  return db('registrations')
    .where({ user_id: userId, event_id: eventId })
    .first();
}

async function cancelRegistration(userId, eventId) {
  return db('registrations')
    .where({ user_id: userId, event_id: eventId })
    .del();
}

async function countRegistrations(eventId) {
  const result = await db('registrations')
    .where({ event_id: eventId })
    .count('user_id as count')
    .first();
  return parseInt(result.count);
}

module.exports = {
  createEvent,
  getEventById,
  getEventWithRegistrations,
  listUpcomingEvents,
  registerUser,
  isUserRegistered,
  cancelRegistration,
  countRegistrations
};
