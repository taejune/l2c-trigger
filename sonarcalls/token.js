const process = require('process');
const url = require("url");
const fetch = require('node-fetch')

function generateToken(name, login) {
    
    console.log(`Generate token which named ${name}`)
    
    const target = new url.URL(`${process.env.SONAR_URL}/api/user_tokens/generate`);
    
    let params = new url.URLSearchParams();
    params.append("name", name);
    if(login) { params.append("login", login); }
    
    target.search = params;

    return fetch(target.toString(), {
        method: 'POST',
        headers: {
            "Authorization": `Basic ${Buffer.from(`admin:admin`).toString('base64')}`
        },
    })
}

function revokeToken(name, login) {
    
    console.log(`Revoke token which named ${name}`)
    
    const target = new url.URL(`${process.env.SONAR_URL}/api/user_tokens/revoke`);
    
    let params = new url.URLSearchParams();
    params.append("name", name);
    if(login) { params.append("login", login); }
    
    target.search = params;

    return fetch(target.toString(), {
        method: 'POST',
        headers: {
            "Authorization": `Basic ${Buffer.from(`admin:admin`).toString('base64')}`
        },
    })
}

module.exports = {
    create: generateToken,
    delete: revokeToken
}