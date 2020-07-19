const process = require('process');
const util = require('util')
const fs = require('fs')
const { spawn } = require('child_process')

var express = require('express');
var router = express.Router();

const access = util.promisify(fs.access)
const chmod = util.promisify(fs.chmod)

router.post('/', function (req, res, next) {

    console.log(`Receive message from sonarqube: \n ${JSON.stringify(req.body)}`)
    const analysisResult = req.body.qualityGate.status
    if (analysisResult === 'SUCCESS') {
        execScript(process.env.SUCCESS_HANDLER_PATH)
            .catch(e => { console.error(e) })
    } else {
        execScript(process.env.FAIL_HANDLER_PATH)
            .catch(e => { console.error(e) })
    }
});

async function execScript(path) {
    try {
        await access(path)
        await chmod(path, 0o755)

        const child = spawn(`./${path}`)
        child.stdout.on('data', (data) => {
            console.log(`${data}`)
        })
        child.stderr.on('data', (data) => {
            console.log(`${data}`)
        })
        child.on('close', (exitcode) => {
            console.log(`process exited with code ${exitcode}`)
        })
    } catch (e) { throw e }
}

module.exports = router;
