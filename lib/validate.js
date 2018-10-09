const DateMask = (input) => {
  if (input.length == 2 || input.length == 5) {
    input = input + '/';
  }
  return input;
}
const replaceAt = (str, index, replacement) => {
  return str.substr(0, index) + replacement+ str.substr(index + replacement.length);
}
const checkEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export {DateMask, PhoneNumber, CMNDNumber, checkEmail};
