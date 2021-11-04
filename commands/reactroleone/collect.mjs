import Collection from "@discordjs/collection";

function reactRoleOne(msg, roles, reactions, records) {
    if(msg.guild) {
        let collect = msg.createReactionCollector({ "dispose": true });

        collect.on("collect", async (reaction, user) => {
            console.log(records[user.id]);
            if(!user.bot) {
                // if there has already been a reaction
                if(records[user.id]) {
                    reaction.users.remove(user);
                } else {
                    records[user.id] = 1; // otherwise, set reactions to 1
                    let member = await msg.guild.members.fetch(user.id);
                    let role = member.guild.roles.cache.find(role => role.name === roles[reactions.indexOf(reaction._emoji.name)]);
    
                    member.roles.add(role);
                }
            }
        });

        collect.on("remove", async (reaction, user) => {
            console.log(records[user.id]);
            // if there are any reaction
            if(!user.bot && records[user.id]) {
                let member = await msg.guild.members.fetch(user.id);
                let role = member.guild.roles.cache.find(role => role.name === roles[reactions.indexOf(reaction._emoji.name)]);

                member.roles.remove(role);

                records[user.id]--;
            }
        });

        setInterval(() => {
            DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id, "reactroleones.messageID": msg.id }, { "$set": { "reactroleones.$.records": records }}, () => {});
        }, 1000);
    }
}

export default reactRoleOne;