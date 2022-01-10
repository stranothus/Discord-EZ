import { ReactionCollector } from "discord.js";

function pollCollect(msg, reactions) {
    if(msg.guild) {
        let collect = msg.createReactionCollector({ "dispose": true });
        let changed = false;

        collect.on("collect", async (reaction, user) => {
            if(user.id !== msg.author.id) {
                if(reactions[user.id]) {
                    reaction.users.remove(user);
                }
                reactions[user.id] = reactions[user.id] ? reactions[user.id] + 1 : 1; // otherwise, set reactions to 1

                changed = true;
            }
        });

        collect.on("remove", async (reaction, user) => {
            reactions[user.id]--;

            changed = true;
        });

        setInterval(() => {
            DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id, "polls.messageID": msg.id }, { "$set": { "polls.$.reactions": reactions }}, () => {});

            if(!changed) return;
            changed = false;

            const totalReactions = msg.reactions.cache.reduce((a, b) => a + b.count - 1, 0);
            let lastIndex = msg.content.lastIndexOf(/\n*Results\:/i);
            if(lastIndex < 0) lastIndex = 0;

            msg.edit(`${msg.content.substring(0, lastIndex || msg.content.length)}\nResults: ${msg.reactions.cache.map(v => {
                const realCount = v.count - 1;
                const ratio = realCount / totalReactions;
                const max = 20;
                const bar = Math.floor(ratio * max);
                const percent = Math.floor(ratio * 100);

                if(bar) {
                    return `\n${v._emoji.name} - ${"\u2588".repeat(bar)} ${percent}%`;
                } else {
                    return `\n${v._emoji.name} - 0%`;
                }

            })}`);
        }, 1000);
    }
}

export default pollCollect;