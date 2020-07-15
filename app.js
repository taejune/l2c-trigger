var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sonarcalls = require('./sonarcalls')
var fs = require('fs')

require('dotenv').config();

var indexRouter = require('./routes/index');
const { fstat } = require('fs');

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


let nTryConnect = 0
let isConnected = false

app.set('ready', false)
// 최초 연결 시까지 5초마다 연결 시도
function looping(){
  nTryConnect += 1

  setTimeout(function() {
    console.log(`try connect to sonarqube(${process.env.SONAR_URL}) ${nTryConnect} times.. `)

    initSoanr()
    .then(() => {
      console.log('connection success.')
      setReady()
    })
    .catch(e => {
      console.error(e)
      looping()
    })
  }, 5000)
}

const TIMEOUT = 1000 * 60 * 3 // 3분
setTimeout(() => {
  if(!isConnected) {
    console.error("Timeout() sonarqube connection")
    process.exit(1)
  }
}, TIMEOUT)

// looping()

// 1분 후부터 연결시도 시작
console.log("Try to connect sonarqube after 1 miniute...")
setTimeout(() => {
  looping()
}, 1000 * 60)

function initSoanr() {
  return sonarcalls.project.create(process.env.PROJECT_ID, process.env.PROJECT_ID)
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
}

// XXX: Setting for kubernetes readiness probe 
function setReady() {
  fs.writeFile('/tmp/ready', 1, (err) => {
    if(err) throw err;
  })
  console.log('Webhook is ready')
}

module.exports = app;
