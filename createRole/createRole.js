const roles = require('../savedRoles/savedRoles.js');
//roles to be saved as the following

/*example of a role object

{
  name:roleName,
  can:{
    post:{
      paths:['/home','/profile:3'],
      conditions:[null,callbackfunction],
    },
    get:    {
      paths:['/home','/profile:3'],
      conditions:[null,callbackfunction],
    },
  }
}*/

//push the role name,and an empty object to state what it can do.. to the array
const createRole = (roleName) => {
  roles.push({
    name: roleName,
    can: {},
  });
};

module.exports = createRole;
