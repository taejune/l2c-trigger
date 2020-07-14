const process = require('process');
const url = require("url");
var fetch = require("node-fetch");
var express = require('express');
var fs = require('fs');
var router = express.Router();

const execSync = require('child_process').execSync

router.post('/', function (req, res, next) {

    console.log(`Receive message from sonarqube: \n${req.body}`)
    const analysisResult = req.body.status
    if(analysisResult === 'SUCCESS') {
        execMigrate()
    } else {
        deployIDE()
    }

    console.log('Terminate program')
    process.exit()
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

    const stdout = execSync(`kubectl create -f ${manifestPath}`)
    console.log(stdout.toString())
    
    return true
}

function deployIDE() {
    console.log("not implmeneted yet...")
}

module.exports = router;
