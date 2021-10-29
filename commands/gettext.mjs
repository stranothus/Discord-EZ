import Tesseract from 'tesseract.js';
import http from 'http';

const r = request.defaults({ encoding: null });

async function gettext(msg, args) {
    console.log(msg.attachments);
    msg.attachments.forEach(e => {
        if(e.contentType === 'image/png') {
            console.log("Converting...");
            http.get(e.proxyUrl, (resp) => {
                resp.setEncoding('base64');
                body = "data:" + resp.headers["content-type"] + ";base64,";
                resp.on('data', (data) => { body += data});
                resp.on('end', () => {
                    console.log(body);
                });
            }).on('error', (e) => {
                console.log(`Got error: ${e.message}`);
            });
        } else {
            console.log(e.contentType);
        }
    });
}

export default gettext;