const process = require('process');
const url = require("url");
const fetch = require('node-fetch')

/*
 * 
 * @ name: Name displayed in the administration console of webhooks
 * @ projectId: The key of the project that will own the webhook
 * @ secret: If provided, secret will be used as the key to generate the HMAC hex (lowercase) digest value in the 'X-Sonar-Webhook-HMAC-SHA256' header
 * @ url: Server endpoint that will receive the webhook payload, for example 'http://my_server/foo'. If HTTP Basic authentication is used, HTTPS is recommended to avoid man in the middle attacks. Example: 'https://myLogin:myPassword@my_server/foo'
 */
function registerWebhook(name, projectId, webhookUrl) {
    console.log(`Register webhook named ${name} for project ID: ${projectId} to ${webhookUrl}`)

    const target = new url.URL(`${process.env.SONAR_URL}/api/webhooks/create`);
    let params = new url.URLSearchParams();
    params.append("name", name);
    params.append("url", webhookUrl);
    if (projectId) { params.append("project", projectId); }
    target.search = params;

    return fetch(target.toString(), {
        method: 'POST',
        headers: {
            "Authorization": `Basic ${Buffer.from(`admin:admin`).toString('base64')}`
        }
    })
}

function listWebhook(projectId) {
    console.log(`List webhook for project: ${projectId}`)

    const target = new url.URL(`${process.env.SONAR_URL}/api/webhooks/list`);
    let params = new url.URLSearchParams();
    params.append("project", projectId);
    target.search = params;

    return fetch(target.toString(), {
        method: 'POST',
        headers: {
            "Authorization": `Basic ${Buffer.from(`admin:admin`).toString('base64')}`
        }
    })
}

function deleteWebhook(name) {
    console.log(`Delete all registered webhook for project: ${projectId}`)

    const target = new url.URL(`${process.env.SONAR_URL}/api/webhooks/delete`);
    let params = new url.URLSearchParams();
    params.append("name", name);
    target.search = params;

    return fetch(target.toString(), {
        method: 'POST',
        headers: {
            "Authorization": `Basic ${Buffer.from(`admin:admin`).toString('base64')}`
        }
    })
}

module.exports = {
    register: registerWebhook,
    list: listWebhook,
    revoke: deleteWebhook
}