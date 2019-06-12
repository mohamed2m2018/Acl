import roles from '../savedRoles/savedRoles.js'
let a, an;
//setters parameters
let roleIndex;
let verbToBeSet;
//setters
a = an = (roleName) => {
  //store the index of the role of the saved array
  roleIndex = roles.findIndex((role) => role.name === roleName);
  if (roleIndex === -1) {
    //if the role hasn't been created throw an error
    throw new Error(
      `You haven't created the ${roleName} role yet, please create it first before setting permissions to it. `
    );
  } else return callCanFunction;
};

const callCanFunction = {
  can: (verb) => {
    verbToBeSet = verb;
    /*checking if this verb doesn't exist, then add the verb key
     with value of object with empty paths and empty conditions*/
    if (!roles[roleIndex].can[verb])
      roles[roleIndex].can[verb] = { paths: [], conditions: [] };

    return callFromOrToFunction;
  },
};

const callFromOrToFunction = {
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
  get to() {
    return this.from;
  },
};

const callWhenFunction = {
  when: (callBackFunction) => {
    let { conditions } = roles[roleIndex].can[verbToBeSet];
    //store the function given by the user to call it when checking
    conditions.push(callBackFunction);
    return true;
  },
};
export { a, an };
