import asUser from "../../utils/asUser.mjs";

function uwu(msg, args) {
    let text = args.slice(1);

    text = text.replace(/(owo)|(ow)|(wo)|(o)/g, "owo").replace(/(uwu)|(uw)|(wu)|(u)/g, "uwu");

    asUser(msg.channel, msg.author, text);
    
    msg.delete();
}

export default uwu;