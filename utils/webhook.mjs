async function webhookSend(channel, options) {
    let webhook = (await channel.fetchWebhooks()).filter(webhook => webhook.name === "Discord-EZ").first() || await channel.createWebhook("Discord-EZ");

    webhook.send(options);
}

export default webhookSend;