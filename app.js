var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var project = require('./sonarcalls/project')
var webhook = require('./sonarcalls/webhook')

require('dotenv').config();

var indexRouter = require('./routes/index');
var webhookRouter = require('./routes/webhook');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/report', webhookRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

project.create(process.env.PROJECT_ID, process.env.PROJECT_ID)
.catch(e => {
  console.error(e)
})
.then(() => {
  webhook.register(process.env.PROJECT_ID, process.env.PROJECT_ID)
  .catch(e => {
    console.error(e)
  })
})

module.exports = app;
