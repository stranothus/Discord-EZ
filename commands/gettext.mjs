import Tesseract from 'tesseract.js';
import request from 'request';

const r = request.defaults({ encoding: null });

async function gettext(msg, args) {
    msg.attachments.forEach(e => {
        if(e.contentType === 'image/png') {
            request.get(e.proxyUrl, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
                    console.log(data);
                }
            });
        }
    });
}

export default gettext;