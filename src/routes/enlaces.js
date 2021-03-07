const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn} = require('../lib/autorizacion');

router.get('/add', isLoggedIn, (request, response) => {
    response.render('enlaces/agregar');
});

router.post("/add", isLoggedIn, async (request, response) => {

    const {titulo, url, descripcion} = request.body;

    const nuevoEnlace = {
        titulo,
        url,
        descripcion,
        user_id: request.user.id 
    };

    await pool.query('INSERT INTO ENLACES SET ?', [nuevoEnlace]);
    request.flash('success', 'Enlace agregado correctamente');
    response.redirect('/links');
});

router.get("/", isLoggedIn, async (request, response) => {
    const links = await pool.query("SELECT * FROM ENLACES WHERE USER_ID = ?", [request.user.id]);
    response.render("../views/enlaces/listar", {links});
});

router.get("/delete/:id", isLoggedIn, async (request, response) => {
    const {id} = request.params;
    await pool.query('DELETE FROM ENLACES WHERE ID = ?', [id]);
    request.flash('success', 'El enlace fue eliminado correctamente');
    response.redirect('/links');
});

router.get("/edit/:id", isLoggedIn, async (request, response) => {
    const {id} = request.params;
    const enlace = await pool.query('SELECT * FROM ENLACES WHERE ID = ?', [id]);
    response.render("../views/enlaces/editar", {enlace: enlace[0]});
});

router.post("/edit/:id", isLoggedIn, async (request, response) => {
    const {id} = request.params;
    const {titulo, url, descripcion} = request.body;
    const nuevoEnlace = {
        titulo,
        url,
        descripcion
    };

    await pool.query('UPDATE ENLACES SET ? WHERE ID = ?', [nuevoEnlace, id]);
    response.flash('success', 'El enlace fue editado correctamente');
    response.redirect('/links');
});

module.exports = router;