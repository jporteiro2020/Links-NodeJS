const {format} = require('timeago.js');

const helpers = {};

//Función utilizada para calcular el tiempo
helpers.timeago = (timestamp) => {
    return format(timestamp);
};

module.exports = helpers;