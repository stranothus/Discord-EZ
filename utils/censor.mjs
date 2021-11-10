async function censor(text, guild) {
    let bannedwords = (await DB.Guilds.collection("Info").findOne({ "id": guild.id })).bannedwords;
    bannedwords.forEach(bannedword => text = text.replace(new RegExp("(" + bannedword + ")", "gi"), $1 => new Array($1.length + 1).join("\\*")));

    return text;
}

export default censor;