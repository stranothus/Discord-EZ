import { ReactionCollector } from "discord.js";

function pollCollect(msg, reactions) {
    let collect = msg.createReactionCollector({ "dispose": true });

    collect.on("collect", async (reaction, user) => {
        if(user.id !== msg.author.id) {
            if(reactions[user.id]) {
                reaction.users.remove(user);
            } else {
                reactions[user.id] = 0;
            }

            reactions[user.id]++;

            DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id, "polls.messageID": msg.id }, { "$set": { "polls.$.reactions": reactions }}, () => {});
        }
    });

    collect.on("remove", async (reaction, user) => {
        reactions[user.id]--;

        DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id, "polls.messageID": msg.id }, { "$set": { "polls.$.reactions": reactions }}, () => {});
    });
}

export default pollCollect;