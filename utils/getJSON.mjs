import fetch from "node-fetch";

/**
 * Gets the JSON of an API endpoint
 * 
 * @param {string} endpoint - the endpoint to fetch
 * 
 * @returns {object|array} data - the data from the endpoint
 */
async function getJSON(endpoint) {
    return await fetch(endpoint).then(response => response.json()).then(data => { return data; }).catch(err => { return undefined; });
}

export default getJSON;