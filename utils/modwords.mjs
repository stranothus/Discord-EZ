import { hyperlink, hideLinkEmbed } from '@discordjs/builders';
import asUser from "../utils/asUser.mjs";

async function modwords(msg) {
    let bannedwords = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).bannedwords;

    if(bannedwords.length) {
        if(new RegExp(bannedwords.join("|").replace(/\*/g, "\\*"), "i").test(msg.content) && !msg.author.bot) {
            let censored = msg.content;

            bannedwords.forEach(bannedword => censored = censored.replace(new RegExp("(" + bannedword.replace(/\*/g, "\\*") + ")", "gi"), $1 => ($1[0] + new Array($1.length).join("\\*"))));

            let repliedTo = msg.reference ? await msg.channel.messages.fetch(msg.reference.messageId) : null;

            asUser(msg.channel, msg.member, msg.type === "REPLY" ? `*[Replying to <@!${repliedTo.author.id}>'s [Message](${hideLinkEmbed(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.reference.messageId}`)})]* - ${censored}` : censored, true, msg.attachments);
            
            msg.delete();
        }
    }
}

export default modwords;