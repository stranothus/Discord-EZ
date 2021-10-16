function deQuote(txt) {
    return txt.replace(/(?:\"$|^\")/g, "");
}

export default deQuote;