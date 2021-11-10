import asUser from "../../utils/asUser.mjs";
import censor from "../../utils/censor.mjs";

async function blarb(msg, args) {
    let text = args.join(" ");

    text = text.split("").map(v => Math.round(Math.random()) ? v.toLowerCase() : v.toUpperCase()).join("");

    asUser(msg.channel, msg.author, await censor(text, msg.guild));
    
    msg.delete();
}

export default blarb;