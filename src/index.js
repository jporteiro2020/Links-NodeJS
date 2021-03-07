const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const path = require('path');
const mySqlStore = require('express-mysql-session');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const {database} = require('./keys');

//Inicializaciones
const app = express();
require('./lib/passport');

//Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', handlebars({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(session({
    secret: 'laFraseMasSecreta',
    resave: false,
    saveUninitialized: false,
    store: new mySqlStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Variables globales
app.use((request, response, next) =>{
    app.locals.success = request.flash('success');
    app.locals.message = request.flash('message');
    app.locals.user = request.user;
    next();
});

//Rutas
app.use(require('./routes/index'));
app.use(require('./routes/autenticacion'));
app.use('/links', require('./routes/enlaces'));

//Public
app.use(express.static(path.join(__dirname, 'public')));

//Empezar servidor
app.listen(app.get('port'), () => {
    console.log('Servidor en el puerto: ' + app.get('port'));
});