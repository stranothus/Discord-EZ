import { ReactionCollector } from "discord.js";

function pollCollect(msg, reactions) {
    if(msg.guild) {
        let collect = msg.createReactionCollector({ "dispose": true });

        collect.on("collect", async (reaction, user) => {
            if(user.id !== msg.author.id) {
                if(reactions[user.id]) {
                    reaction.users.remove(user);
                }
                records[user.id] = records[user.id] ? records[user.id] + 1 : 1; // otherwise, set reactions to 1
            }
        });

        collect.on("remove", async (reaction, user) => {
            records[user.id]--;
        });

        setInterval(() => {
            DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id, "polls.messageID": msg.id }, { "$set": { "polls.$.reactions": reactions }}, () => {});
        }, 1000);
    }
}

export default pollCollect;