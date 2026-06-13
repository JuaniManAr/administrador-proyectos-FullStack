const db = require('../data/db');
const { publicUser } = require('./auth.service');

function list() {
  const data = db.read();
  return data.usuarios.map(publicUser);
}

module.exports = { list };
