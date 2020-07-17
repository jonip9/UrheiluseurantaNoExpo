function checkNan(str) {
  return isNaN(str) || (str === null) ? '' : str.toString();
}

export {checkNan};
