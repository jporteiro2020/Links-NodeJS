const bcrypt = require('bcryptjs');
const helpers = {};

//Función para encriptar una contraseña ingresada. Se utiliza un hash
helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

//Función utilizada para comparar contraseñas ingresadas
helpers.matchPassword = async (password, savePassword) => {
    try {
        return await bcrypt.compare(password, savePassword);
    } catch (error) {
        console.log(error);
    }
};

module.exports = helpers;