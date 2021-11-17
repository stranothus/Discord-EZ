/**
 * Censors text based on the banned words in a guild
 * 
 * @typedef {import("discord.js")} Guild
 * 
 * @param {string} text - the text to censor
 * @param {Guild} guild  - the guild to get banned words from
 * 
 * @returns {Promise<string>} censored - the censored text
 */
async function censor(text, guild) {
    let bannedwords = (await DB.Guilds.collection("Info").findOne({ "id": guild.id })).bannedwords;
    bannedwords.forEach(bannedword => text = text.replace(new RegExp("(" + bannedword + ")", "gi"), $1 => new Array($1.length + 1).join("\\*")));

    return text;
}

export default censor;