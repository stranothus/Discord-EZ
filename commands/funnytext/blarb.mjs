import censor from "../../utils/censor.mjs";

async function blarb(text) {
    text = (await censor(text, msg.guild)).split("").map(v => Math.round(Math.random()) ? v.toLowerCase() : v.toUpperCase()).join("");

    return text;
}

export default blarb;