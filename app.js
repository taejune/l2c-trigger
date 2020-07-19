var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs')
var sonarcalls = require('./sonarcalls')
var util = require('util')

const readFile = util.promisify(fs.readFile)

require('dotenv').config();

const Client = require('kubernetes-client').Client
const Request = require('kubernetes-client/backends/request')

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
    const backend = new Request(Request.config.getInCluster())
    const client = new Client({ backend })
    await client.loadSpec()

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
  const hostname = (process.env.HOSTNAME)? process.env.HOSTNAME : os.hostname()
  sonarcalls.webhook.register(process.env.PROJECT_NAME, '', `http://${hostname}:${process.env.PORT}`)
    .catch(e => { console.error(e) })
}

module.exports = app