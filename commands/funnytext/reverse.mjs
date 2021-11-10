import censor from "../../utils/censor.mjs";

async function reverse(text) {
    text = (await censor(text, msg.guild)).split("").reverse().join("");

    return text;
}

export default reverse;