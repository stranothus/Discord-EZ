import asUser from "../../utils/asUser.mjs";
import censor from "../../utils/censor.mjs";

function uwu(msg, args) {
    let text = args.join(" ");

    text = text.replace(/(owo)|(ow)|(wo)|(o)/gi, "owo").replace(/(uwu)|(uw)|(wu)|(u)/gi, "uwu");

    asUser(msg.channel, msg.author, censor(text));
    
    msg.delete();
}

export default uwu;