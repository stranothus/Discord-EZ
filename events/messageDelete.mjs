import asUser from "../utils/asUser.mjs";

async function messageDelete(msg) {
    let bannedwords = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).bannedwords;

    if(new Date().getTime() - msg.createdTimestamp < 100000 && (msg.mentions.everyone || msg.mentions.users.first() || msg.mentions.roles.first() || msg.type === "REPLY") && !new RegExp(bannedwords.join("|"), "i").test(msg.content)) {
        asUser(msg.channel, msg.author, msg.type === "REPLY" ? `*[Replying to <@!${msg.author.id}>'s [Message](${hideLinkEmbed(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.reference.messageId}`)})]* - ${msg.content}` : msg.content);
    }
}

export default messageDelete;