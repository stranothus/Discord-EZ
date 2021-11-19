import censor from "../../utils/censor.mjs";

async function shakespeare(text, guild) {
    text = (await censor(text, guild)).replace(/hey,? you/gi, "hark thee").replace(/you/gi, "thou").replace(/(?:it is)|(?:it's)/gi, "'tis").replace(/friend/gi, "cousin").split(" ").map(v => {
        let end = v.match(/([^a-z]+)$/);
        v = v.replace(/([^a-z]+)$/, "");
        if("aeiou".indexOf(v.slice(-1)) + 1) return v + (end ? end[0] : "");
        if(v.slice(-1) === "d") return v + "st" + (end ? end[0] : "");
        if(v) return v + (Math.round(Math.random()) ? "eth" : "") + (end ? end[0] : "");
        return (end ? end[0] : "");
    }).join(" ");

    return text;
}

export default shakespeare;