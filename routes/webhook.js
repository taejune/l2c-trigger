const process = require('process');
const url = require("url");
var fetch = require("node-fetch");
var express = require('express');
var router = express.Router();

const execSync = require('child_process').execSync

router.post('/listen', function (req, res, next) {
    console.log(res.json().body)

    const analysisResult = res.json().body.status
    if(analysisResult === 'SUCCESS') {
        execMigrate()
    } else {
        deployIDE()
    }
});

router.get('/test', function (req, res, next) {
    console.log("test")
    execMigrate()
    .then(data => {
        console.log(data);
    })
    .catch(e => {
        console.error(e)
    })
});


function execMigrate() {
    console.log("kubectl create -f test/test-service.yaml")
    const stdout = execSync("kubectl create -f test/test-service.yaml")
    console.log(stdout.toString())
}

function deployIDE() {

}

module.exports = router;
