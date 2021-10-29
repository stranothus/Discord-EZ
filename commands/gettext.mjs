import { createWorker } from 'tesseract.js';
import fetch from 'node-fetch';

const worker = createWorker();

(async () => {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
});

async function gettext(msg, args) {
    msg.attachments.forEach(async e => {
        if(e.contentType === 'image/png') {
            let base64 = await fetch(e.proxyURL).then(r => r.buffer()).then(buf => `data:image/png;base64,` + buf.toString('base64'));
            console.log(base64);
            let data = await worker.recognize(base64);
            console.log(data);
        } else {
            console.log(e.contentType + " is not supported");
        }
    });
}

export default gettext;