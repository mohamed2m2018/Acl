const createRole = require('./createRole/createRole');
const { a, an } = require('./setters/setters');
const check = require('./checkers/checkers');

module.exports = {
  createRole: createRole,
  a: a,
  an: an,
  check: check,
};
