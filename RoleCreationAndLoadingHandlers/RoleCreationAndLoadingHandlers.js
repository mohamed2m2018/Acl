const fs = require('fs');

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

const createRole=(roleName)=> {
  //create roles list and initiate it with an empty list
  var roles = [];
  try {
    roles = JSON.parse(fs.readFileSync('file.json', 'utf-8'));
    roles.push({
      name: roleName,
      can: {},
    });

    fs.writeFileSync('file.json', JSON.stringify(roles));

    return true;
  } catch (err) {
    roles.push({
      name: roleName,
      can: {},
    });
    //then write it to a file
    fs.writeFileSync('file.json', JSON.stringify(roles));

    return true;
  }
}


const loadRoles = () => {
  var roles = [];
  try{
  roles = JSON.parse(fs.readFileSync('file.json', 'utf-8'));
  }
  catch(err){
    console.log(err)
  }
  return roles;
};

const saveRoles =(roles)=>{
  fs.writeFileSync('file.json', JSON.stringify(roles));

}



module.exports = {createRole,loadRoles,saveRoles};
