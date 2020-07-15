const process = require('process');
const url = require("url");
var fetch = require("node-fetch");
var express = require('express');
var fs = require('fs');
var router = express.Router();

const execSync = require('child_process').execSync

router.post('/', function (req, res, next) {

    console.log(`Receive message from sonarqube: \n ${JSON.stringify(req.body)}`)
    const analysisResult = req.body.qualityGate.status
    if(analysisResult === 'SUCCESS') {
        console.log('migrate possible')
        execMigrate()
    } else {
        console.log('migrate impossible')
        deployIDE()
    }
});

router.get('/success', function (req, res, next) {
    execMigrate()
    console.log('Terminate program')
    process.exit()
});

router.get('/fail', function (req, res, next) {
    console.log('Terminate program')
    process.exit(1)
});

function execMigrate() {
    const manifestPath = "/tmp/l2c-run-instance.yaml"

    if(!fs.existsSync(manifestPath)) {
        console.error('Cannot found manifest file: ' + manifestPath)
        return false
    }

    console.log(`kubectl create -f ${manifestPath}`)
    const stdout = execSync(`kubectl create -f ${manifestPath}`)
    console.log(stdout.toString())
    
    return true
}

function deployIDE() {
    const manifestPath = "/tmp/deploy-vscode-instance.yaml"

    if(!fs.existsSync(manifestPath)) {
      console.error('Cannot found manifest file: ' + manifestPath)
      return false
    }
    console.log(`kubectl create -f ${manifestPath}`)
    const stdout = execSync(`kubectl create -f ${manifestPath}`)
    console.log(stdout.toString())
}

module.exports = router;
