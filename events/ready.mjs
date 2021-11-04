import guildCreate  from "./guildCreate.mjs";
import reactRole    from "../commands/reactrole/collect.mjs";
import pollCollect  from "../commands/poll/collect.mjs";
import unmute       from "../commands/mute/unmute.mjs";
import reactRoleOne from "../commands/reactroleone/collect.mjs";

async function ready() {
	console.log(`Logged in as ${client.user.tag}!`);

    // get all guild ids
    const guilds = client.guilds.cache.map(guild => guild.id);
    
    guilds.forEach(guildID => {
        DB.Guilds.collection("Info").findOne({ "id": guildID }, async function(err, result) {
            if(err) console.error(err);

            if(result) {
                // reinitiate reactroles
                for(let i = 0; i < result.reactroles.length; i++) {
                    let index = result.reactroles[i];
                    let guild = client.guilds.cache.get(guildID);
                    let channel = guild.channels.cache.get(index.channelID);
                    let message = await channel.messages.fetch(index.messageID).catch(err => { return false; });

                    if(message) {
                        let roles = index.reacttorole.map(v => v.role);
                        let reactions = index.reacttorole.map(v => v.emoji);

                        reactRole(message, roles, reactions);
                    }
                }
                // reinitiate reactroles
                for(let i = 0; i < result.reactroleones.length; i++) {
                    let index = result.reactroleones[i];
                    let guild = client.guilds.cache.get(guildID);
                    let channel = guild.channels.cache.get(index.channelID);
                    let message = await channel.messages.fetch(index.messageID).catch(err => { return false; });

                    if(message) {
                        let roles = index.reacttorole.map(v => v.role);
                        let reactions = index.reacttorole.map(v => v.emoji);

                        reactRoleOne(message, roles, reactions);
                    }
                }
                // reinitiate polls
                for(let i = 0; i < result.polls.length; i++) {
                    let index = result.polls[i];
                    let guild = client.guilds.cache.get(guildID);
                    let channel = guild.channels.cache.get(index.channelID);
                    let message = await channel.messages.fetch(index.messageID).catch(err => { return false; });

                    if(message) {
                        pollCollect(message, index.reactions);
                    }
                }

                // reinitite muted timers
                let mutedRole = result.moderation.muteRole;
                for(let i = 0; i < result.members.length; i++) {
                    let index = result.members[i];
                    if(index.muted) {
                        let guild = client.guilds.cache.get(guildID);
                        let mutedUser = guild.members.resolve(index.id);
                        
                        if(!mutedUser) {
                            continue;
                        }

                        let timeMuted = index.muted - new Date().getTime();

                        unmute(mutedUser, mutedRole, timeMuted, guild);
                    }
                }
            } else {
                // if the guild has been added while the bot was offline, go through server setup
                let guild = client.guilds.cache.get(guildID);

                guildCreate(guild);
            }
        });
    });
}

export default ready;