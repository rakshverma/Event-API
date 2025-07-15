const db = require('../db/knex.js');

async function getUserById(id) {
  return db('users').where({ id }).first();
}

module.exports = {
  getUserById
};
