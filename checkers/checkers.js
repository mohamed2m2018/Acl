let roles = require('../savedRoles/savedRoles');
const arePathsEqual = require('./WhenCheckerFunctions/arePathsEqual');
const makeParamsObject = require('./WhenCheckerFunctions/makeParamsObject');

//checking parameter
let roleIndex;
let verbToBeChecked;
let checkedPath;
let conditionIndex;
let checkingState;

const check = {
  if: (roleName) => {
    checkingState = true;
    //check if this role has been created or not
    roleIndex = roles.findIndex((role) => role.name === roleName);
    if (roleIndex === -1)
      throw new Error(
        `You haven't created the ${roleName} role yet, please create it first before setting permissions to it. `
      );
    else return checkCanFunction;
  },
};

const checkCanFunction = {
  can: (verb) => {
    verbToBeChecked = verb;
    //if verb doesn't exist turn checkingState into false
    if (!roles[roleIndex].can[verb]) checkingState = false;
    //go to (to) function or (for) depending on the verb
    return verb === 'post' || verb === 'put'
      ? checkToFunction
      : checkFromFunction;
  },
};

const checkFromFunction = {
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
    //inverse checking state from true to false then return it as path is not found
    else return !checkingState;
  },
};

const checkToFunction = {
  to: checkFromFunction.from,
};

const checkWhenFunction = {
  when: (...args) => {
    //checking state equals false return false
    if (!checkingState) return false;
    //destructuring
    let { paths, conditions } = roles[roleIndex].can[verbToBeChecked];
    //get the stored callback function
    const callBackFunction = conditions[conditionIndex];
    //construct the params object from the stored path
    const params = makeParamsObject(checkedPath, paths[conditionIndex]);
    //path params to the callback function if it has a value, along with user arguments
    if (callBackFunction !== null) return callBackFunction(params, ...args);
    return true;
  },
};

module.exports = check;
