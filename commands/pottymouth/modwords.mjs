import { hyperlink, hideLinkEmbed } from '@discordjs/builders';
import webhookSend from "../../utils/webhook.mjs";

async function modwords(msg) {
    let bannedwords = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).bannedwords;

    if(bannedwords.length) {
        if(new RegExp(bannedwords.join("|"), "i").test(msg.content) && !msg.author.bot) {
            webhookSend(msg.channel, {
                "content": msg.type === "REPLY" ? `*[Replying to <@!${msg.author.id}>'s [Message](${hideLinkEmbed(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.reference.messageId}`)})]* - ${censored}` : censored,
                "avatarURL": `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`,
                "username": msg.author.username,
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