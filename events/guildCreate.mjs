import muterole from "../utils/mutrole.mjs";
import { Permissions } from "discord.js";

async function guildCreate(guild) {
    if(!guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return;
    
    // go through server setup
    let members = await guild.members.fetch();
    let muteRole = await guild.roles.create({ name: "Muted", permissions: [] });

    guild.channels.cache.forEach(channel => {
        if(channel.type === "GUILD_TEXT" || channel.type === "GUILD_VOICE") {
            channel.permissionOverwrites.create(muteRole, {
                "SEND_MESSAGES": false,
                "ADD_REACTIONS": false,
                "SEND_MESSAGES_IN_THREADS": false,
                "CREATE_PUBLIC_THREADS": false,
                "CREATE_PRIVATE_THREADS": false
            });
        }
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