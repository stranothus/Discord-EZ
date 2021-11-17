async function checkwords(msg) {
    let bannedwords = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).bannedwords;

    if(bannedwords.length) {
        msg.channel.send("Banned words: ||" + bannedwords.join(", ") + "||");
    } else {
        msg.channel.send("You have no banned words");
    }
}

export default checkwords;