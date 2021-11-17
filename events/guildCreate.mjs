import muterole from "../utils/mutrole.mjs";

async function guildCreate(guild) {
    // go through server setup
    let members = await guild.members.fetch();
    let muteRole = await muterole(guild);

    guild.channels.cache.forEach(channel => {
        channel.permissionOverwrites.create(muteRole, {
            "SEND_MESSAGES": false,
            "ADD_REACTIONS": false,
            "SEND_MESSAGES_IN_THREADS": false,
            "CREATE_PUBLIC_THREADS": false,
            "CREATE_PRIVATE_THREADS": false
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