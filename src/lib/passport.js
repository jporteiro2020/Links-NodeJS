const passport = require('passport');
const strategy = require('passport-local').Strategy;

//const pool = require('../database');
const helpers = require('../lib/helpers');

/*Función utilizada para el login de usuarios. Se utiliza la función matchPassword para validar la contraseña ingresada
Y la que está guardada en la base de datos.*/
passport.use('local.signin', new strategy({
    usernameField: 'userName',
    passwordField: 'password',
    passReqToCallback: true
}, async (request, userName, password, done) => {
    const rows = await pool.query('SELECT * FROM USUARIOS WHERE USERNAME = ?', [userName]);

    if(rows.length > 0){
        const usuario = rows[0];
        const validPassword = await helpers.matchPassword(password, usuario.password);

        if(validPassword){
            done(null, usuario, request.flash('success', 'Bienvenido ' + usuario.username));
        }else{
            done(null, false, request.flash('message', 'El usuario o la contraseña no son correctos'));
        }
    }else{
        done(null, false, request.flash('message', 'El usuario o la contraseña no son correctos'))
    }
}));

/*FUnción utilizada para crear un nuevo usuario en la base de datos.
  Se utiliza la función encryptPassword que está dentro del js helpers*/
passport.use('local.signup', new strategy({
    usernameField: 'userName',
    passwordField: 'password',
    passReqToCallback: true
}, async (request, userName, password, done) => {

    const {fullname} = request.body;
    const nuevoUsuario = {
        userName,
        password,
        fullname
    };

    nuevoUsuario.password = await helpers.encryptPassword(password);

    const result = await pool.query('INSERT INTO USUARIOS SET ?', [nuevoUsuario]);

    nuevoUsuario.id = result.insertId;

    return done(null, nuevoUsuario);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);

});

passport.deserializeUser(async (id, done) =>{
    const rows = await pool.query('SELECT * FROM USUARIOS WHERE ID = ?', [id]);
    return done(null, rows[0]);
});