import Collection from "@discordjs/collection";

function reactRoleOne(msg, ids, reactions, records) {
    if(msg.guild) {
        let collect = msg.createReactionCollector({ "dispose": true });

        collect.on("collect", async (reaction, user) => {
            if(!user.bot) {
                // if there has already been a reaction
                if(records[user.id]) {
                    reaction.users.remove(user);
                } else {
                    let member = await msg.guild.members.fetch(user.id);
                    let id = ids[reactions.indexOf(reaction._emoji.name)];
                    let role = await member.guild.roles.fetch(id);
                    
                    if(role) {
                        member.roles.add(role);
                    } else {
                        (await msg.guild.fetchOwner()).send("Someone tried to react to get " + id + " but it looks like that role has been edited or deleted :(")
                    }
                }

                records[user.id] = records[user.id] ? records[user.id] + 1 : 1; // otherwise, set reactions to 1
            }
        });

        collect.on("remove", async (reaction, user) => {
            // if there are any reaction
            if(!user.bot && records[user.id]) {
                let member = await msg.guild.members.fetch(user.id);
                let id = ids[reactions.indexOf(reaction._emoji.name)];
                let role = await member.guild.roles.fetch(id);
                
                if(role) {
                    member.roles.remove(role);
                } else {
                    (await msg.guild.fetchOwner()).send("Someone tried to react to remove " + id + " but it looks like that role has been edited or deleted :(")
                }

                records[user.id]--;
            }
        });

        setInterval(() => {
            DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id, "reactroleones.messageID": msg.id }, { "$set": { "reactroleones.$.records": records }}, () => {});
        }, 1000);
    }
}

export default reactRoleOne;