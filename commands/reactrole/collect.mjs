import Collection from "@discordjs/collection";

function reactRole(msg, roles, reactions) {
    if(msg.guild) {
        let collect = msg.createReactionCollector({ "dispose": true });

        collect.on("collect", async (reaction, user) => {
            if(!user.bot) {
                let member = await msg.guild.members.fetch(user.id);
                let role = member.guild.roles.cache.find(role => role.name === roles[reactions.indexOf(reaction._emoji.name)]);

                member.roles.add(role);
            }
        });

        collect.on("remove", async (reaction, user) => {
            if(!user.bot) {
                let member = await msg.guild.members.fetch(user.id);
                let role = member.guild.roles.cache.find(role => role.name === roles[reactions.indexOf(reaction._emoji.name)]);

                member.roles.remove(role);
            }
        });
    }
}

export default reactRole;