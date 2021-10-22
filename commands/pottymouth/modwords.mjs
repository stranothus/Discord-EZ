async function modwords(msg) {
    let bannedwords = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).bannedwords;

    if(bannedwords.length) {
        if(new RegExp(bannedwords.join("|"), "i").test(msg.content) && !msg.author.bot) {
            let webhook = (await msg.channel.fetchWebhooks()).filter(webhook => webhook.name === msg.author.username).first() || await msg.channel.createWebhook(msg.author.username);

            let censored = msg.content;

            bannedwords.forEach(bannedword => censored = censored.replace(new RegExp("(" + bannedword + ")", "gi"), $1 => new Array($1.length + 1).join("\\*")));

            webhook.send({
                "content": censored,
                "allowedMentions": {
                    "roles": [],
                    "users": [],
                    "parse": []
                }
            });
            msg.delete();
        }
    }
}

export default modwords;