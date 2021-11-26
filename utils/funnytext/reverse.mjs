import censor from "../../utils/censor.mjs";

async function reverse(text, guild) {
    text = (await censor(text.split("").reverse().join(""), guild));

    return text;
}

export default reverse;