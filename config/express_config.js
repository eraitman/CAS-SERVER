var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var config = require('./config');
var passport = require('passport');
var flash = require('connect-flash');
module.exports = function () {
    var app = express();


    // view engine setup
    app.set('views', path.join(__dirname, '../app/views'));
    app.set('view engine', 'pug');

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

    //logger setup
    app.use(logger('dev'));

    // parser setup
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // cookie & session setup
    app.use(cookieParser());
    app.use(session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: true
    }));
    app.use('/', express.static(path.join(__dirname, '../public')));

    //passport 설정
    require('./passport_config.js')(passport);
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    
    //routing
    require('../app/routes/index.route.js')(app, passport);
    require('../app/routes/login.route.js')(app, passport);
    require('../app/routes/main.route.js')(app, passport);

    return app;
}