const {createRole,clearAllRoles} = require('./RoleCreationAndLoadingHandlers/RoleCreationAndLoadingHandlers');
const { a, an } = require('./setters/setters');
const check = require('./checkers/checkers');

module.exports = { createRole, a, an, check,clearAllRoles };
