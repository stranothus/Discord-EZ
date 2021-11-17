/**
 * Removes surrounding quotes
 * 
 * @param {string} txt - the text to de-quote
 * 
 * @returns {string} de-quoted
 */
function deQuote(txt) {
    return txt.replace(/(?:\"$|^\")/g, "");
}

export default deQuote;