
const bcrypt = require('bcrypt');

//se crean 2 contraseñas; a) se crea hash a la contraseña; b) se creala contraseña y se compara.

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (password,user) => bcrypt.compareSync(password,user.password);

module.exports = {createHash, isValidPassword}