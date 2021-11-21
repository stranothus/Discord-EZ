import guildCreate  from "./guildCreate.mjs";
import reactRole    from "../commands/reactrole/collect.mjs";
import pollCollect  from "../commands/poll/collect.mjs";
import unmute       from "../commands/mute/unmute.mjs";
import reactRoleOne from "../commands/reactroleone/collect.mjs";
import muterole from "../utils/mutrole.mjs";

async function ready() {
	console.log(`Logged in as ${client.user.tag}!`);

    const guilds = client.guilds.cache;

    guilds.forEach(guild => {
        DB.Guilds.collection("Info").findOne({ "id": guild.id }, async function(err, result) {
            if(err) console.error(err);

            if(result) {
                // reinitiate reactroles
                for(let i = 0; i < result.reactroles.length; i++) {
                    let index = result.reactroles[i];
                    let channel = guild.channels.cache.get(index.channelID);
                    let message = await channel.messages.fetch(index.messageID).catch(err => { return false; });

                    if(message) {
                        let ids = index.reacttorole.map(v => v.id);
                        let reactions = index.reacttorole.map(v => v.emoji);

                        reactRole(message, ids, reactions);
                    } else {
                        DB.Guilds.collection("Info").updateOne({ "id": guildID }, { "$pull": { "reactroles": { "messageID": index.messageID }}}, (err, result) => {});
                    }
                }
                // reinitiate reactroles
                for(let i = 0; i < result.reactroleones.length; i++) {
                    let index = result.reactroleones[i];
                    let channel = guild.channels.cache.get(index.channelID);
                    let message = await channel.messages.fetch(index.messageID).catch(err => { return false; });

                    if(message) {
                        let ids = index.reacttorole.map(v => v.id);
                        let reactions = index.reacttorole.map(v => v.emoji);
                        
                        reactRoleOne(message, ids, reactions, index.records || []);
                    } else {
                        DB.Guilds.collection("Info").updateOne({ "id": guildID }, { "$pull": { "reactroleones": { "messageID": index.messageID }}}, (err, result) => {});
                    }
                }
                // reinitiate polls
                for(let i = 0; i < result.polls.length; i++) {
                    let index = result.polls[i];
                    let channel = guild.channels.cache.get(index.channelID);
                    let message = await channel.messages.fetch(index.messageID).catch(err => { return false; });

                    if(message) {
                        pollCollect(message, index.reactions);
                    } else {
                        DB.Guilds.collection("Info").updateOne({ "id": guildID }, { "$pull": { "polls": { "messageID": index.messageID }}}, (err, result) => {});
                    }
                }

                // reinitite muted timers
                let mutedRole = await muterole(guild);
                for(let i = 0; i < result.members.length; i++) {
                    let index = result.members[i];
                    if(index.muted) {
                        let mutedUser = guild.members.resolve(index.id);
                        
                        if(!mutedUser) {
                            continue;
                        }

                        let timeMuted = index.muted - new Date().getTime();

                        unmute(mutedUser, mutedRole, timeMuted, guild);
                    }
                }
                guild.channels.cache.forEach(channel => {
                    if(channel.type === "GUILD_TEXT" || channel.type === "GUILD_VOICE") {
                        channel.permissionOverwrites.create(mutedRole, {
                            "SEND_MESSAGES": false,
                            "ADD_REACTIONS": false,
                            "SEND_MESSAGES_IN_THREADS": false,
                            "CREATE_PUBLIC_THREADS": false,
                            "CREATE_PRIVATE_THREADS": false
                        });
                    }
                });
            } else {
                // if the guild has been added while the bot was offline, go through server setup
                let g = client.guilds.cache.get(guild.id);

                guildCreate(g);
            }
        });
    });
}

export default ready;