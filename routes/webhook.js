const process = require('process');
const url = require("url");
var fetch = require("node-fetch");
var express = require('express');
var fs = require('fs');
var router = express.Router();

const execSync = require('child_process').execSync

router.post('/listen', function (req, res, next) {

    const analysisResult = res.json().body.status
    if(analysisResult === 'SUCCESS') {
        console.log('Sonnar report Success')
        execMigrate()
    } else {
        console.log('Sonnar report Fail')
        deployIDE()
    }
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
