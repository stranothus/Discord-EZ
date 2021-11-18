/**
 * Sends a message as a user through a webhook
 * 
 * @typedef {import("discord.js")} TextChannel
 * @typedef {import("discord.js")} User
 * 
 * @param {TextChannel} channel - the channel to message
 * @param {User} author - the user to message as
 * @param {string} content - the content to send
 * 
 * @returns {void}
 */
async function asUser(channel, author, content) {
    if(channel.type === "GUILD_PUBLIC_THREAD" || channel.type === "GUILD_PRIVATE_THREAD") {
        let webhook = (await channel.parent.fetchWebhooks()).filter(webhook => webhook.name === client.user.tag).first() || await channel.parent.createWebhook(client.user.tag);

        webhook.send({
            "content": content,
            "avatarURL": `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png`,
            "username": author.username,
            "allowedMentions": {
                "roles": [],
                "users": [],
                "parse": []
            },
            "threadId": channel.id
        });
    } else {
        let webhook = (await channel.fetchWebhooks()).filter(webhook => webhook.name === client.user.tag).first() || await channel.createWebhook(client.user.tag);

        webhook.send({
            "content": content,
            "avatarURL": `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png`,
            "username": author.username,
            "allowedMentions": {
                "roles": [],
                "users": [],
                "parse": []
            }
        });
    }
}

export default asUser;