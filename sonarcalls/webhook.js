const process = require('process');
const url = require("url");
const fetch = require('node-fetch')

function registerWebhook(name, projectId, secret) {
    console.log(`Register webhook named ${name} for project ID: ${projectId}`)

    const target = new url.URL(`${process.env.SONAR_URL}/api/webhooks/create`);
    let params = new url.URLSearchParams();
    params.append("name", name);
    params.append("project", projectId);
    // params.append("secret", project);
    params.append("url", `http://${process.env.SERVER}:${process.env.PORT}/report/listen`);
    target.search = params;

    return fetch(target.toString(), {
        method: 'POST',
        headers: {
            "Authorization": `Basic ${Buffer.from(`admin:admin`).toString('base64')}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw `[${response.status}] Failed to create webhook - ${response.statusText}`
            }
            return response;
        });
}

module.exports = {
    register: registerWebhook
}