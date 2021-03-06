var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var session = require('express-session');

var routes = require('./routes/index');
var author = require('./routes/author');

var app = express();
var autoLogout = 120000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(express.static(path.join(__dirname, 'public')));

// Autologout
app.use(function(req, res, next){

  if(req.session.user) {
     if (req.session.lastAccess && ((Date.now() - req.session.lastAccess) > autoLogout)) {
         req.session.lastAccess = Date.now();
         res.redirect('/logout');
    } else {
      req.session.lastAccess = Date.now();
    }
  }
  next();
});

// Helpers dinamicos:
app.use(function(req, res, next) {

	// guardar path en session.redir para despues de login
	if (!req.path.match(/\/login|\/logout/)) {
		req.session.redir = req.path;
	}
	// hacer visible req.session en las vistas
	res.locals.session = req.session;
	next();
});

app.use('/', routes);
app.use('/author', author);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
