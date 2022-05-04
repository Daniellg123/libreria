var bcrypt = require('bcryptjs');
var encryp = {};


encryp.encryptPassword = async (password) => {
  var salt = await bcrypt.genSalt(10);
  var hash = await bcrypt.hash(password, salt);
  return hash;
};

encryp.matchPassword = async (password, savedPassword) => {
  try {
    return await bcrypt.compare(password, savedPassword);
  } catch (e) {
    console.log(e)
  }
};

module.exports = encryp;