const makeParamsObject = (checkedPath, storedPath) => {
  //split when / is found
  const checkedPathArray = checkedPath.split('/');
  const storedPathArray = storedPath.split('/');
  let valuesFound = [];
  for (let i = 0; i < checkedPathArray.length; i++) {
    if (storedPathArray[i].includes(':')) {
      //store values of the checked path that correspond to :params in the stored path
      valuesFound.push(checkedPathArray[i]);
    }
  }

  //params array stores the words that follow : symbol with the regular expression below
  paramsArray = storedPath.match(/(?<=:)(\w*)/g);
  paramsObject = {};
  for (let i = 0; i < paramsArray.length; i++) {
    //if the param is a number convert it to a number not a string
    paramsObject[paramsArray[i]] = Number(valuesFound[i])
      ? Number(valuesFound[i])
      : valuesFound[i];
  }

  return paramsObject;
};

module.exports = makeParamsObject;
