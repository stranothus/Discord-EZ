import Collection from "@discordjs/collection";

function reactRole(msg, roles, reactions) {
    if(msg.guild) {
        let collect = msg.createReactionCollector({ "dispose": true });

        collect.on("collect", async (reaction, user) => {
            if(!user.bot) {
                let member = await msg.guild.members.fetch(user.id);
                let role = member.guild.roles.cache.find(role => role.name === roles[reactions.indexOf(reaction._emoji.name)]);
                
                if(role) {
                    member.roles.add(role);
                } else {
                    (await msg.guild.fetchOwner()).send("Someone tried to react to get " + roles[reactions.indexOf(reaction._emoji.name)] + " but it looks like that role has been edited or deleted :(")
                }
            }
        });

        collect.on("remove", async (reaction, user) => {
            if(!user.bot) {
                let member = await msg.guild.members.fetch(user.id);
                let role = member.guild.roles.cache.find(role => role.name === roles[reactions.indexOf(reaction._emoji.name)]);
                
                if(role) {
                    member.roles.remove(role);
                } else {
                    (await msg.guild.fetchOwner()).send("Someone tried to react to remove " + roles[reactions.indexOf(reaction._emoji.name)] + " but it looks like that role has been edited or deleted :(")
                }
            }
        });
    }
}

export default reactRole;