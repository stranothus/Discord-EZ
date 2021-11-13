async function guildCreate(guild) {
    // go through server setup
    let members = await guild.members.fetch();
    let muteRole = guild.roles.cache.find(x => /muted/i.test(x.name)) || await guild.roles.create({ name: "Muted", permissions: [] });

    guild.channels.cache.forEach(channel => {
        channel.permissionOverwrites.create(muteRole, {
            "SEND_MESSAGES": false,
            "ADD_REACTIONS": false
        });
    });

    DB.Guilds.collection("Info").insertOne({
        "id": guild.id,
        "name": guild.name,
        "prefix": "=",
        "members": members.map(v => !v.user.bot ? {
            "id": v.user.id,
            "muted": false,
            "roles": v.member ? v.member.roles : [],
            "infractions": []
        } : false).filter(v => v),
        "reactroles": [],
        "reactroleones": [],
        "polls": [],
        "bannedwords": [],
        "moderation": {
            "spamcap": false,
            "ignorespam": [],
            "mutes": [],
            "infractions": [],
            "muteRole": muteRole.id
        }
    }, function(err, result) {
        if(err) console.error(err);
    });
}

export default guildCreate;