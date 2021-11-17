import censor from "../../utils/censor.mjs";

async function piglatin(text, guild) {
    text = (await censor(text, guild)).split(" ").map(v => {
        if(!v.length) return "Get gud";
        let base = v.replace(/[^a-z>]$/i, "");
        if("aeiou<".indexOf(v[0]) === -1) base = base.substring(1) + base[0].toLowerCase();
        base += "ay";
        if(v.match(/[^a-z>]$/i)) base += v.match(/[^a-z>]$/i);
        return base;
    }).join(" ");

    return await censor(text, guild);
}

export default piglatin;