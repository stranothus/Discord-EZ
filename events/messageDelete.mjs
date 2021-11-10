async function messageDelete(msg) {
    let bannedwords = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).bannedwords;

    if(new Date().getTime() - msg.createdTimestamp < 100000 && (msg.mentions.everyone || msg.mentions.users.first() || msg.mentions.roles.first() || msg.type === "REPLY") && !new RegExp(bannedwords.join("|"), "i").test(msg.content)) {
        let webhook = (await msg.channel.fetchWebhooks()).filter(webhook => webhook.name === "Discord-EZ-Censor").first() || await msg.channel.createWebhook("Discord-EZ-Censor");

        if(msg.type === "REPLY") {
            webhook.send({
                "content": `*[Replying to <@!${msg.author.id}>'s [Message](${hideLinkEmbed(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.reference.messageId}`)})]* - ${msg.content}`,
                "avatarURL": `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`,
                "username": msg.author.username,
                "allowedMentions": {
                    "roles": [],
                    "users": [],
                    "parse": []
                }
            });
        } else {
            webhook.send({
                "content": msg.content,
                "avatarURL": `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`,
                "username": msg.author.username,
                "allowedMentions": {
                    "roles": [],
                    "users": [],
                    "parse": []
                }
            });
        }
    }
}

export default messageDelete;