const process = require('process');
const url = require("url");
var fetch = require("node-fetch");
var express = require('express');
var router = express.Router();

const execSync = require('child_process').execSync

router.post('/listen', function (req, res, next) {
    
    console.log("GOT analysis report by webhook!!!!")
    console.log(JSON.stringify(res, null, ' '))
    console.log("----")
    console.log(res)
    console.log("----")
    console.log(res.body)
    // createL2CPipelineRun(projectId)
    // .then(data => {
    //     console.log(data);
    // })
    // .catch(e => {
    //     console.error(e)
    // })
});

router.get('/test', function (req, res, next) {
    
    console.log("test")
    createL2CPipelineRun()
    .then(data => {
        console.log(data);
    })
    .catch(e => {
        console.error(e)
    })
});


function createL2CPipelineRun() {
    console.log("kubectl create -f test/test-service.yaml")
    const stdout = execSync("kubectl create -f test/test-service.yaml")
    console.log(stdout.toString())
}

module.exports = router;
