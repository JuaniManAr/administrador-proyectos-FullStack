const fs = require('fs');
const path = require('path');
const createSeed = require('./seed');

const fileName = process.env.NODE_ENV === 'test' ? 'test-db.json' : 'db.json';
const filePath = path.join(__dirname, fileName);

function init() {
  if (!fs.existsSync(filePath)) {
    write(createSeed());
  }
}

function read() {
  init();
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function write(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function reset() {
  write(createSeed());
}

module.exports = { init, read, write, reset };
