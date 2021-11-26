import censor from "../../utils/censor.mjs";

async function lego(text, guild) {
    text = "omg bestie " + (await censor(text, guild)).toLowerCase() + " gaslight gatekeep girlboss";

    return text;
}

export default lego;