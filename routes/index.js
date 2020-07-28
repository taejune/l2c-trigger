const process = require('process');
const fs = require('fs')
const { spawn } = require('child_process')
const Client = require('kubernetes-client').Client
const client = new Client({ version: '1.13' })

var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {

    console.log(`Receive message from sonarqube:`)
    console.log(`${JSON.stringify(req.body, null, 2)}`)
    
    const projectName = req.body.proejct.key
    const analysisResult = req.body.qualityGate.status
    
    console.log(`${projectName}: ${analysisResult}`)
    if (analysisResult === 'OK') {
        execFromConfigMapData(projectName, process.env.SUCCESS_HANDLER_PATH)
            .catch(e => { console.error(e) })
    } else {
        execFromConfigMapData(projectName, process.env.FAIL_HANDLER_PATH)
            .catch(e => { console.error(e) })
    }
});

async function execFromConfigMapData(projectName, handlerName) {
    const handlers = await loadConfigMapData(projectName)
    execScript(handlers[handlerName])
}

async function loadConfigMapData(name) {
    console.log(`Load configmap: ${name}`)
    
    let configmap
    
    try {
        const ns = await readFile('/var/run/secrets/kubernetes.io/serviceaccount/namespace');
        configmap = await client.api.v1.namespaces(ns).configmaps(`${name}`).get()
    
    } catch (e) {
        console.error(e)
    }
    
    console.log(`configmap: ${configmap}`)
    return configmap.body.data
}

async function execScript(script) {
    console.log(`script: ${script}`)

    try {
        const child = spawn('sh', ['-c', `${script}`])

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
