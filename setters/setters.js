let roles = require('../savedRoles/savedRoles');
let a, an;
//setters parameters
let roleIndex;
let verbToBeSet;
//setters
a = an = (roleName) => {
  indexFound = roles.findIndex((role) => role.name === roleName);
  if (indexFound === -1) {
    //if the role hasn't been created throw an error
    throw new Error(
      `You haven't created the ${roleName} role yet, please create it first before setting permissions to it. `
    );
  } else {
    //store the index of the role in the saved array
    roleIndex = indexFound;
    return callCanFunction;
  }
};

const callCanFunction = {
  can: (verb) => {
    verbToBeSet = verb;
    /*checking if this verb doesn't exist, then add the verb key
     with value of object with empty paths and empty conditions*/
    if (!roles[roleIndex].can[verb])
      roles[roleIndex].can[verb] = { paths: [], conditions: [] };

    //if post return (to) object in order to call to(), else return (from) object in order to call from()
    return verb === 'post' || verb === 'put'
      ? callToFunction
      : callFromFunction;
  },
};

const callFromFunction = {
  from: (path) => {
    //destructuring of paths and conditions
    let { paths, conditions } = roles[roleIndex].can[verbToBeSet];
    //if path doesn't exist
    if (!paths.includes(path)) {
      //add path
      paths.push(path);
      //if doesn't contain params add a null condition
      if (!path.includes(':')) conditions.push(null);
    }
    return callWhenFunction;
  },
};

const callToFunction = {
  to: callFromFunction.from,
};

const callWhenFunction = {
  when: (callBackFunction) => {
    let { conditions } = roles[roleIndex].can[verbToBeSet];
    //store the function given by the user to call it when checking
    conditions.push(callBackFunction);
    return true;
  },
};
module.exports = {
  a: a,
  an: an,
};
