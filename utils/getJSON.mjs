import fetch from "node-fetch";

async function getJSON(endpoint) {
    return await fetch(endpoint).then(response => response.json()).then(data => { return data; });
}

export default getJSON;