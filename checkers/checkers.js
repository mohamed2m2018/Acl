let {loadRoles}=require('../RoleCreationAndLoadingHandlers/RoleCreationAndLoadingHandlers');
let roles;
const users=require('../savedUsers/savedUsers');
const arePathsEqual =require('./WhenCheckerFunctions/arePathsEqual.js');
const makeParamsObject=require('./WhenCheckerFunctions/makeParamsObject.js');

//checking parameter
let roleIndex;
let verbToBeChecked;
let checkedPath;
let conditionIndex;
let checkingState;

const check = {
  ifRole: (roleName) => {
    roles=loadRoles();
    checkingState = true;
    //check if this role has been created or not
    roleIndex = roles.findIndex((role) => role.name === roleName);
    if (roleIndex === -1)
      throw new Error(
        `You haven't created the ${roleName} role yet, please create it first before setting permissions to it. `
      );
    else return checkCanFunction;
  },
  ifUser: (userId) => {
    checkingState = true;
    //check if this id has been assigned a role or not
    if (users[userId]) roleName = users[userId];
    else
      throw new Error(
        `You haven't assigned roles to user with id ${userId} yet, please assign id to it first before checking it. `
      );
    roleIndex = roles.findIndex((role) => role.name === roleName);

    return checkCanFunction;
  },
};

const checkCanFunction = {
  can: (verb) => {
    verbToBeChecked = verb;
    //if verb doesn't exist turn checkingState into false
    if (!roles[roleIndex].can[verb]) checkingState = false;
    //go to (to) function or (for) function
    return checkFromOrToFunction;
  },
};

const checkFromOrToFunction = {
  from: (path) => {
    //if the checking state is false return false as the verb wasn't found in the previous stage
    if (!checkingState) return checkingState;
    //set the path to be checked with the given path
    checkedPath = path;
    //destructuring
    let { paths, conditions } = roles[roleIndex].can[verbToBeChecked];
    //get the path index of the path that matches the path to be checked
    const pathIndex = paths.findIndex((storedpath) =>
      arePathsEqual(path, storedpath)
    );
    //if the path is found
    if (pathIndex !== -1) {
      //set the condition index to path index as they have the same value
      conditionIndex = pathIndex;
      //if there is no condition return the current state else return the object that contains the when function
      return conditions[conditionIndex] === null
        ? checkingState
        : checkWhenFunction;
    }
    //inverse checking state from true to false then return it because path is not found
    else return !checkingState;
  },
  get to() {
    return this.from;
  },
};

const checkWhenFunction = {
  when: (...args) => {
    //checking if state equals false return false
    if (!checkingState) return false;
    //destructuring
    let { paths, conditions } = roles[roleIndex].can[verbToBeChecked];
    //get the stored callback function
    const callBackFunction = conditions[conditionIndex];
    //construct the params object from the stored path
    const params = makeParamsObject(checkedPath, paths[conditionIndex]);
    //pass params to the callback function, if it has a value, along with other user arguments
    if (callBackFunction !== null) return eval(callBackFunction)(params, ...args);
    return true;
  },
};

module.exports=check;
