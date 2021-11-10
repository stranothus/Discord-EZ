import censor from "../../utils/censor.mjs";

async function uwu(text, guild) {
    text = (await censor(text, guild)).replace(/l|r/gi, "w").replace(/(?:[^\b])th/gi, "dd").replace(/n([aeiou])/gi, "ny$1");

    return text;
}

export default uwu;