//a function to check if two paths are equal even if they include params
const arePathsEqual = (pathToBeChecked, storedPath) => {
  const pathToBeCheckedArray = pathToBeChecked.split('/');
  const storedPathArray = storedPath.split('/');

  for (let i = 0; i < storedPathArray.length; i++) {
    if (
      !storedPathArray[i].includes(':') &&
      pathToBeCheckedArray[i] !== storedPathArray[i]
    )
      return false;
  }

  return true;
};

module.exports = arePathsEqual;
