const users = require('../savedUsers/savedUsers');
let {loadRoles}=require('../RoleCreationAndLoadingHandlers/RoleCreationAndLoadingHandlers');
let roles=loadRoles();
const assignRole = (userId, roleName) => {
  roleIndex = roles.findIndex((role) => role.name === roleName);
  if (roleIndex === -1)
    throw new Error(
      `${roleName} role doesn't exist ! You have to create this role first using the createRole method :D `
    );
  users[userId] = roleName;
};

module.exports = assignRole;
