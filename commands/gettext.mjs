import { createWorker } from 'tesseract.js';
import fetch from 'node-fetch';

var worker = false;
const resolved = new Promise(async (resolve, reject) => {
    let w = createWorker();
    await w.load();
    await w.loadLanguage('eng');
    await w.initialize('eng');

    worker = w;
    resolve(true);
});

async function gettext(msg, args) {
    msg.attachments.forEach(async e => {
        if(e.contentType === 'image/png') {
            let base64 = await fetch(e.proxyURL).then(r => r.buffer()).then(buf => `data:image/png;base64,` + buf.toString('base64'));
            if(!worker) await resolved;
            let data = await worker.recognize(base64);
            
            msg.channel.send(data.data.text);
        } else {
            msg.channel.send(e.contentType + " is not supported");
        }
    });
}

export default gettext;