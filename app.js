var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sonarcalls = require('./sonarcalls')

require('dotenv').config();

var indexRouter = require('./routes/index');

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


sonarcalls.project.create(process.env.PROJECT_ID, process.env.PROJECT_ID)
  .then(res => res.json())
  .then(data1 => {
    console.log(data1)
    
    sonarcalls.webhook.list(process.env.PROJECT_ID)
    .then(res => res.json())
    .then(data2 => {
      console.log(data2)
      const found = data2.webhooks.find(e => e.name === process.env.PROJECT_ID)
      if (!found) {
        sonarcalls.webhook.register(process.env.PROJECT_ID, process.env.PROJECT_ID, process.env.WEBHOOK_URL)
          .then(response => response.json())
          .then(data3 => { console.log(data3) })
          .catch(e => { console.error(e)})
      }
    })
  })
  .catch(e => {
    console.error(e)
  })


module.exports = app;
