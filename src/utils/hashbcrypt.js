const bcrypt = require('bcryptjs');

// Se crean 2 funciones para: a) crear hash de la contraseña; b) comparar la contraseña con el hash almacenado.
const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

module.exports = { createHash, isValidPassword };