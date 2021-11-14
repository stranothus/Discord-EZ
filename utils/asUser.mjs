async function asUser(channel, author, content) {
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

export default asUser;