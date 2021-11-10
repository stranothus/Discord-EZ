import asUser from "../../utils/asUser.mjs";

function blarb(msg, args) {
    let text = args.join(" ");

    text = text.split("").map(v => Math.round(Math.random()) ? v.toLowerCase() : v.toUpperCase()).join("");

    asUser(msg.channel, msg.author, text);
    
    msg.delete();
}

export default blarb;