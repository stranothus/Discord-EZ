async function channelCreate(channel) {
    let muteRole = channel.guild.roles.cache.find(x => /muted/i.test(x.name)) || await channel.guild.roles.create({ name: "Muted", permissions: [] });

    channel.permissionOverwrites.create(muteRole, {
        "SEND_MESSAGES": false,
        "ADD_REACTIONS": false,
        "SEND_MESSAGES_IN_THREADS": false,
        "CREATE_PUBLIC_THREADS": false,
        "CREATE_PRIVATE_THREADS": false
    });
}

export default channelCreate;