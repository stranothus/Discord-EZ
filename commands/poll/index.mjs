import { MessageEmbed } from "discord.js";
import Collection from "@discordjs/collection";
import pollCollect from "../pollCollect.mjs";

async function poll(msg, args) {
    if(args.length % 2) {
        msg.channel.send("Use `=help poll` to learn how to use this command");
    }

    let msgs = args
        .map((v, i, a) => ((i % 2) ? undefined : {
            content: `${v} ${a[i + 1]}`,
            emoji: a[i + 1],
            option: v
        }))
        .filter(v => v);

    let content = msgs.map(v => v.content);
    let emojis = msgs.map(v => v.emoji);
    let options = msgs.map(v => v.role);

    msg = await msg.channel.send(content.join("\n"));

    DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id }, { "$push": { "polls": {
        messageID: msg.id,
        channelID: msg.channel.id,
        reactions: {}
    }}}, function(err, result) {
        if(err) console.error(err);
    });
    
    emojis.forEach(v => (msg ? msg.react(v).catch(err => {
        let channel = msg.channel;
        msg.delete();

        channel.send("Something went wrong. Please make sure you are using valid emojis");
    }) : ""));

    pollCollect(msg, {});
}

export default poll;