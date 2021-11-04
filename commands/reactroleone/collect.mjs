import Collection from "@discordjs/collection";

function reactRoleOne(msg, roles, reactions) {
    if(msg.guild) {
        let collect = msg.createReactionCollector({ "dispose": true });

        collect.on("collect", async (reaction, user) => {
            console.log(reactions[user.id]);
            if(!user.bot) {
                if(reactions[user.id]) {
                    reaction.users.remove(user);
                } else {
                    reactions[user.id] = 1;
                    let member = await msg.guild.members.fetch(user.id);
                    let role = member.guild.roles.cache.find(role => role.name === roles[reactions.indexOf(reaction._emoji.name)]);
    
                    member.roles.add(role);
                }
            }
        });

        collect.on("remove", async (reaction, user) => {
            console.log(reactions[user.id]);
            if(!user.bot) {
                let member = await msg.guild.members.fetch(user.id);
                let role = member.guild.roles.cache.find(role => role.name === roles[reactions.indexOf(reaction._emoji.name)]);

                member.roles.remove(role);

                if(reactions[user.id]) {
                    reactions[user.id]--;
                }
            }
        });

        setInterval(() => {
            DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id, "reactroleones.messageID": msg.id }, { "$set": { "reactroleones.$.reactions": reactions }}, () => {});
        }, 1000);
    }
}

export default reactRoleOne;