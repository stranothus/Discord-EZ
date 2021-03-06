import { Permissions } from "discord.js";
import { hideLinkEmbed } from "@discordjs/builders";
import asUser from "../utils/asUser.mjs";

async function messageDelete(msg) {
    if(!msg.guild) return;
    if(!msg.guild.me.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS)) return;

    let guild = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id }));
    let bannedwords = guild.bannedwords;
    let prefix = guild.prefix;

    if(new Date().getTime() - msg.createdTimestamp < 100000 && (msg.mentions.everyone || msg.mentions.users.first() || msg.mentions.roles.first() || msg.type === "REPLY") && !new RegExp(bannedwords.join("|"), "i").test(msg.content) && !msg.content.startsWith(prefix) && !msg.content.match(new RegExp("^<@!?" + client.user + ">\\s*"))) {
        if(msg.mentions.repliedUser && msg.mentions.repliedUser.bot) return;

        let repliedTo = msg.reference ? await msg.channel.messages.fetch(msg.reference.messageId) : null;

        asUser(msg.channel, msg.member, msg.type === "REPLY" ? `*[Replying to <@!${repliedTo.id}>'s [Message](${hideLinkEmbed(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.reference.messageId}`)})]* - ${msg.content}` : msg.content, false, msg.attachments);
    }
}

export default messageDelete;