/**
*Module Dependencies
*/
var
  express = require('express'),
  ejsLayouts = require('express-ejs-layouts'),
  path = require('path'),
  passport = require('./config/passport'),
  bParser = require('body-parser'),
  logger = require('morgan'),
  config = require('./config/config'),
  session = require('express-session'),
  mongoose = require('mongoose'),
  mongoStore = require('connect-mongo')(session);
//=============================================================================
/**
*Create App instance
*/
var app = express();
//=============================================================================
/**
*Module variables
*/
var
  port = process.env.PORT || 3030,
  env = config.env,
  dbURL = config.dbURL,
  sessionSecret = config.sessionSecret,
  sessStore,
  db,
  routes = require('./routes/routes'),
  auth = require('./routes/auth')(passport),
  renderHandlers = require('./views/render');
app.locals.errMsg = app.locals.errMsg || null;
app.locals.profile = app.locals.profile || null;
app.locals.person= app.locals.person || null;
//=============================================================================
/**
*App Configuration and Settings
*/
require('clarify');
app.disable('x-powered-by');
app.set('port', port);
app.set('env', env);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('layout', 'layouts');
//=============================================================================
/**
*dBase connection
*/
mongoose.connect(dbURL);
db = mongoose.connection;
db.on('error', function (err) {
  console.error('There was a db connection error');
  return  console.error(err.message);
});
db.once('connected', function () {
  return console.log('Successfully connected to ' + dbURL);
});
db.once('disconnected', function () {
  return console.error('Successfully disconnected from ' + dbURL);
});
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.error('dBase connection closed due to app termination');
    return process.exit(0);
  });
});
sessStore = new mongoStore({
  mongooseConnection: mongoose.connection,
  touchAfter: 24 * 3600});
//=============================================================================
/**
*Middleware stack
*/
app.use(logger('dev'));
app.use(bParser.json());
app.use(bParser.urlencoded({extended: true}));
app.use(session({
  name: 'xpressevents.sess', store: sessStore, secret: sessionSecret, resave: true,
  saveUninitialized: false, cookie: {maxAge: 1000 * 60 * 15}}));
app.use(ejsLayouts);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/auth', express.static(path.join(__dirname, 'public')));//ensures that the
//path to static files is via '/public' rather than passing thru '/auth'
//=============================================================================
/**
*Routes
*/
app.use('/', routes);
app.use('/auth', auth);
//=============================================================================
/**
*Event Handlers
*/
app.on('getRoot', renderHandlers.root);
app.on('getLogin', renderHandlers.login);
app.on('failedLogin', renderHandlers.failedLogin);
app.on('getSignup', renderHandlers.signup);
app.on('failedSignup', renderHandlers.failedSignup);
app.on('getDashboard', renderHandlers.dashboard);
//=============================================================================
/**
*Custom Error handler
*/
app.use(function (err, req, res, next) {
  console.error(err.stack);
  return res.status(500).render('pages/errors');
});
/**
*Export Module
*/
module.exports = app;
//=============================================================================
