import censor from "../../utils/censor.mjs";

async function uwu(text) {
    text = (await censor(text, msg.guild)).replace(/(owo)|(ow)|(wo)|(o)/gi, "owo").replace(/(uwu)|(uw)|(wu)|(u)/gi, "uwu");

    return text;
}

export default uwu;