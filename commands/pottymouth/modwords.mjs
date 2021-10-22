import { hyperlink, hideLinkEmbed } from '@discordjs/builders';

async function modwords(msg) {
    let bannedwords = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).bannedwords;

    if(bannedwords.length) {
        if(new RegExp(bannedwords.join("|"), "i").test(msg.content) && !msg.author.bot) {
            let webhook = (await msg.channel.fetchWebhooks()).filter(webhook => webhook.name === msg.author.username).first() || await msg.channel.createWebhook(msg.author.username);

            let censored = msg.content;

            bannedwords.forEach(bannedword => censored = censored.replace(new RegExp("(" + bannedword + ")", "gi"), $1 => new Array($1.length + 1).join("\\*")));

            if(msg.type === "REPLY") {
                webhook.send({
                    "content": `*[Replying to <@!${msg.author.id}>'s [Message](${hideLinkEmbed(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.reference.messageId}`)})]* - ${censored}`,
                    "allowedMentions": {
                        "roles": [],
                        "users": [],
                        "parse": []
                    }
                });
            } else {
                webhook.send({
                    "content": msg.content,
                    "allowedMentions": {
                        "roles": [],
                        "users": [],
                        "parse": []
                    }
                });
            }
            msg.delete();
        }
    }
}

export default modwords;