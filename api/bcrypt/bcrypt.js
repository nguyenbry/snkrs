const bcrypt = require("bcrypt");
const saltRounds = 11;

function hash(string_) {
  return bcrypt.hash(string_, saltRounds);
}

function compare(inputPassword, hashDatabasePassword) {
  return bcrypt.compare(inputPassword, hashDatabasePassword);
}

module.exports = {
  hash, compare
}