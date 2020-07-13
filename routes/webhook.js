const process = require('process');
const url = require("url");
var fetch = require("node-fetch");
var express = require('express');
var router = express.Router();

router.post('/listen', function (req, res, next) {
    
    console.log("GOT analysis report by webhook!!!!")

    let projectId = 123
    
    return createL2CPipelineRun(projectId)
    .then(data => {
        console.log(data);
    })
    .catch(e => {
        console.error(e)
    })
});


function createL2CPipelineRun(projectId) {
    console.log("not implemented...")

    return projectId
}

module.exports = router;
