const process = require('process');
const url = require("url");
const fetch = require('node-fetch')


function createProject(id, name) {
    console.log(`Create sonarqube Project: ID/ Name: ${id}/ ${name}`)
    
    const target = new url.URL(`${process.env.SONAR_URL}/api/projects/create`);
    let params = new url.URLSearchParams();
    params.append("project", id);
    params.append("name", name);
    target.search = params;

    return fetch(target.toString(), {
        method: 'POST',
        headers: {
            "Authorization": `Basic ${Buffer.from(`admin:admin`).toString('base64')}`
        },
    })
}

function setQualityProfile(lang, name, projectId) {
    const target = new url.URL(`${process.env.SONAR_URL}/api/qualityprofiles/add_project`);
    let params = new url.URLSearchParams();
    params.append("language", lang);
    params.append("qualityProfile", name);
    params.append("project", projectId);
    target.search = params;

    return fetch(target.toString(), {
        method: 'POST',
        headers: {
            "Authorization": `Basic ${Buffer.from(`admin:admin`).toString('base64')}`
        },
    })
}

module.exports = {
    create: createProject
}