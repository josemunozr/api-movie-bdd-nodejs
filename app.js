var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./lib/config');

var app = express();

//mongoose.connect(config.database);
mongoose.createConnection(config.database);

var auth_middleware = require('./lib/middleware/auth')
var auth = require('./routes/auth')
var index = require('./routes/index')
var movie = require('./routes/movie')
var user = require('./routes/user')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// rutas inseguras
app.use('/', index)
app.use('/auth', auth)
app.use('/user', user)

// Middleware
app.use(auth_middleware)

// rutas seguras
app.use('/movie', movie)

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

  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);

});


module.exports = app;
