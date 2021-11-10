import censor from "../../utils/censor.mjs";

async function reverse(text, guild) {
    text = (await censor(text, guild)).split("").reverse().join("");

    return text;
}

export default reverse;