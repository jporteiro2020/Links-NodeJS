const express = require('express');
const router = express.Router();

const passport = require('passport');
const {isLoggedIn, isNotLoggedIn} = require('../lib/autorizacion');

//Renderiza la vista registrar
router.get('/registrar', isNotLoggedIn, (request, response) => {
    response.render('../views/autenticacion/registrar');
});

router.post('/registrar', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/registrar',
    failureFlash: true
}));

//Renderiza la vista iniciarSesion
router.get('/signin', (request, response) => {
    response.render('../views/autenticacion/iniciarSesion');
});

router.post('/signin', isNotLoggedIn, (request, response, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(request, response, next);
});

//Renderiza la vista profile
router.get('/profile', isLoggedIn, (request, response) => {
    response.render('profile');
});

//Función para cerrar sesión
router.get('/logout', isLoggedIn, (request, response) => {
    request.logOut();
    response.redirect('signin');
});

module.exports = router;