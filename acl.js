let roles = [];
const createRole = (roleName) => {
  roles.push({
    name: roleName,
    can: {},
  });
};
let a, an;
let roleIndex;
let CurrentVerb;
let checkedPath;
let conditionIndex;

//setters
a = an = (roleName) => {
  //check if this role has been created or not
  indexFound = roles.findIndex((role) => role.name === roleName);
  if (indexFound === -1) {
    throw new Error(
      `You haven't created the ${roleName} role yet, please create it first before setting permissions to it. `
    );
  } else {
    roleIndex = indexFound;
    return callCanFunction;
  }
};

const callCanFunction = {
  can: (verb) => {
    if (!roles[roleIndex].can[verb]) {
      roles[roleIndex].can[verb] = { paths: [], conditions: [] };
    }
    CurrentVerb = verb;
    if (verb === 'post' || verb === 'put') return callToFunction;
    else return callFromFunction;
  },
};

const callToFunction = {
  to: (path) => {
    if (!roles[roleIndex].can[CurrentVerb].paths.includes(path))
      roles[roleIndex].can[CurrentVerb].paths.push(path);
    console.log(roles);
    return callWhenFunction;
  },
};

const callFromFunction = {
  from: (path) => {
    if (!roles[roleIndex].can[CurrentVerb].paths.includes(path)) {
      roles[roleIndex].can[CurrentVerb].paths.push(path);
      if (!path.includes(':'))
        roles[roleIndex].can[CurrentVerb].conditions.push(null);
      else {
      }
    }
    console.log(roles);
    return callWhenFunction;
  },
};

const callWhenFunction = {
  when: (callBackFunction) => {
    roles[roleIndex].can[CurrentVerb].conditions.push(callBackFunction);
    return true;
  },
};

//checkers

const check = {
  if: (roleName) => {
    //check if this role has been created or not
    indexFound = roles.findIndex((role) => role.name === roleName);
    if (indexFound === -1) {
      throw new Error(
        `You haven't created the ${roleName} role yet, please create it first before setting permissions to it. `
      );
    } else {
      roleIndex = indexFound;
      return checkCanFunction;
    }
  },
};

const checkCanFunction = {
  can: (verb) => {
    if (roles[roleIndex].can[verb]) {
      if (verb === 'post' || verb === 'put') return checkToFunction;
      else return checkFromFunction;
    } else {
      return false;
    }
  },
};

const checkToFunction = {
  //a.some((path)=>arePathsEqual('a/b/c',path)
  to: (path) => {
    console.log('hi')
    if (
      roles[roleIndex].can[CurrentVerb].paths.some((storedpath) =>
        arePathsEqual(path, storedpath)
      )
    ) {
      checkedPath = path;
      return checkWhenFunction;
    } else return false;
  },
};

const checkFromFunction = {
  from: (path) => {
    const pathIndex = roles[roleIndex].can[CurrentVerb].paths.findIndex(
      (storedpath) => arePathsEqual(path, storedpath)
    );
    if (pathIndex !== -1) {
      checkedPath = path;
      conditionIndex = pathIndex;
      return checkWhenFunction;
    } else return false;
  },
};

const checkWhenFunction = {
  when: (...args) => {
    //rest operator
    const callBackFunction =
      roles[roleIndex].can[CurrentVerb].conditions[conditonIndex];

    const params = makeParamsObject(
      checkedPath,
      roles[roleIndex].can[CurrentVerb].paths[conditonIndex]
    );
    if (callBackFunction !== null) {
      return callBackFunction(params, ...args);
    }
    return true;
  },
};

const arePathsEqual = (pathToBeChecked, storedPath) => {
  const pathToBeCheckedArray = pathToBeChecked.split('/');
  const storedPathArray = storedPath.split('/');

  for (let i = 0; i < pathToBeCheckedArray.length; i++) {
    if (
      !storedPathArray[i].includes(':') &&
      pathToBeCheckedArray[i] !== storedPathArray[i]
    ) {
      return false;
    }
  }

  return true;
};

const makeParamsObject = (checkedPath, storedPath) => {
  const checkedPathArray = checkedPath.split('/');
  const storedPathArray = storedPath.split('/');
  let valuesFound = [];
  for (let i = 0; i < checkedPathArray.length; i++) {
    if (storedPathArray[i].includes(':')) {
      valuesFound.push(checkedPathArray[i]);
    }
  }

  paramsArray = storedPath.match(/(?<=:)(\w*)/g);
  paramsObject = {};
  for (let i = 0; i < paramsArray.length; i++) {
    paramsObject[paramsArray[i]] = Number(valuesFound[i]);
  }

  return paramsObject;
};

createRole('admin');
createRole('guest');

a('guest')
  .can('post')
  .to('posts/hi');
// export { a, an,check,};

console.log(check.if('guest').can('post').to('posts/hi'))