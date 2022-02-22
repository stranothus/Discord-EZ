import { ReactionCollector } from "discord.js";

function pollCollect(msg, reactions) {
    if(msg.guild) {
        let collect = msg.createReactionCollector({ "dispose": true });
        let changed = false;

        collect.on("collect", async (reaction, user) => {
            if(user.id !== msg.author.id) {
                if(reactions[user.id] || reaction.count < 2) {
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
            let lastIndex = msg.content.lastIndexOf("Results:");
            if(lastIndex < 0) lastIndex = 0;

            msg.edit(`${msg.content.substring(0, lastIndex || msg.content.length)}Results: ${msg.reactions.cache.map(v => {
                const realCount = v.count - 1;
                const ratio = realCount / totalReactions;
                const max = 20;
                const bar = Math.round(ratio * max);
                const percent = Math.round(ratio * 100);
                const emojiText = v._emoji.id ? `<${v._emoji.animated ? "a" : ""}:${v._emoji.name}:${v._emoji.id}>` : v._emoji.name

                if(bar) {
                    return `\n${emojiText} - ${"\u2588".repeat(bar)} ${percent}%`;
                } else {
                    return `\n${emojiText} - 0%`;
                }

            })}`);
        }, 1000);
    }
}

export default pollCollect;