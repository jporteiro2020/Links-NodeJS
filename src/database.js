const mysql = require('mysql');
const{promisify} = require('util');

const {database}  = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((error, connection) => {
    if(error){
        if(error.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('La conexion con la base de datos fue cerrada');
        }
        if(error.code === 'ER_CON_COUNT_ERROR'){
            console.error('La base de datos tiene muchas conexiones');
        }
        if(error.code === 'ECONNREFUSED'){
            console.error('La conexion a la base de datos fue rechazada');
        }
    }else{
        console.log('Se ha establecido conexion con la base de datos');
    }
    
    if(connection) connection.release();
    return;
});

pool.query = promisify(pool.query);
 
module.exports = pool;