import Collection from "@discordjs/collection";

function reactRole(msg, ids, reactions) {
    if(msg.guild) {
        let collect = msg.createReactionCollector({ "dispose": true });

        collect.on("collect", async (reaction, user) => {
            if(!user.bot) {
                let member = await msg.guild.members.fetch(user.id);
                let id = ids[reactions.indexOf(reaction._emoji.name)];
                let role = await member.guild.roles.fetch(id);

                if(role) {
                    member.roles.add(role);
                } else {
                    (await msg.guild.fetchOwner()).send("Someone tried to react to get " + id + " but it looks like that role has been edited or deleted :(")
                }
            }
        });

        collect.on("remove", async (reaction, user) => {
            if(!user.bot) {
                let member = await msg.guild.members.fetch(user.id);
                let id = ids[reactions.indexOf(reaction._emoji.name)];
                let role = await member.guild.roles.fetch(id);
                
                if(role) {
                    member.roles.remove(role);
                } else {
                    (await msg.guild.fetchOwner()).send("Someone tried to react to remove " + id + " but it looks like that role has been edited or deleted :(")
                }
            }
        });
    }
}

export default reactRole;