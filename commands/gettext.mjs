import Tesseract from 'tesseract.js';
import fetch from 'node-fetch';

async function gettext(msg, args) {
    console.log(msg.attachments);
    msg.attachments.forEach(async e => {
        if(e.contentType === 'image/png') {
            console.log("Converting...");
            console.log(await fetch(e.proxyUrl).then(r => r.buffer()).then(buf => `data:image/png;base64,` + buf.toString('base64')));
        } else {
            console.log(e.contentType + " is not supported");
        }
    });
}

export default gettext;