var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs')
var sonarcalls = require('./sonarcalls')
var util = require('util')
const Client = require('kubernetes-client').Client

const readFile = util.promisify(fs.readFile)

require('dotenv').config();

var indexRouter = require('./routes/index');

console.log('Running l2c-precheck-controller version 0.0.1')

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
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log('Wait until sonarqube available')
waitDeploymentAvailable(process.env.SONAR_DEPLOYMENT_NAME, setupReportHandler)

async function waitDeploymentAvailable(depName, callback) {
  try {
    const client = new Client({ version: '1.13' })
    const ns = await readFile('/var/run/secrets/kubernetes.io/serviceaccount/namespace');
    const stream = await client.apis.apps.v1.watch.namespaces(ns).deployments.getObjectStream()

    stream.on('data', evt => {
      if (evt.object.metadata.name === depName) {
        if (evt.object.status.readyReplicas > 0) {
          console.log(`Deployment(${depName}) is available`)
          setTimeout(() => { callback() }, 1000 * 15)
        }
      }
    })

  } catch (err) {
    console.error('Error: ', err)
  }
}

function setupReportHandler() {
  const webhookName = 'l2c-precheck-controller'
  const hostname = (process.env.HOSTNAME)? process.env.HOSTNAME : os.hostname()
  const webhookUrl = `http://${hostname}:${process.env.PORT}`
  sonarcalls.webhook.register(webhookName, '', webhookUrl)
    .catch(e => { console.error(e) })
}

module.exports = app