import pollCollect from "../utils/poll.mjs";
import { SlashCommandBuilder } from "@discordjs/builders";
import deQuote from "../utils/deQuote.mjs";

export default {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("create a poll for users to vote in"),
    description: `poll [option] [emoji]...\` makes me hold a poll. Users can react with \`[emoji]\` on the message to make me give them \`[role name]\`, but they can only react once, so voting is fair. Options must be contained in quotation marks if spaces are present.
    Optionally, add a final argument at the end. This should be a string of text to format each option off of. Use {option} and {emoji} in the text to be replaced with each option and emoji.`,
    category: "misc",
    DMs: false,
    execute: async function(interaction) {
        interaction.reply("Use the text variation instead. Discord doesn't support variadic arguments in slash commands")
    },
    executeText: async function(msg, args) {
        let prefix = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix;
    
        let format = args.length % 2 ? args[args.length - 1] : false;
    
        if(args.length < 2) {
            msg.channel.send("Use `" + prefix + "help poll` to learn how to use this command");
            return;
        }
        
        if(format) {
            args.pop();
        }
    
        let msgs = args
            .map((v, i, a) => ((i % 2) ? undefined : {
                content: format ? format.replace(/{option}/g, v).replace(/{emoji}/g, a[i + 1]) : `${v} ${a[i + 1]}`,
                emoji: a[i + 1],
                option: v
            }))
            .filter(v => v)
            .slice(0, 20);
    
        let content = msgs.map(v => v.content);
        let emojis = msgs.map(v => v.emoji);
        let options = msgs.map(v => v.role);
    
        msg = await msg.channel.send(content.join("\n") + "\nResults:");
    
        DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id }, { "$push": { "polls": {
            messageID: msg.id,
            channelID: msg.channel.id,
            reactions: {}
        }}}, function(err, result) {
            if(err) console.error(err);
        });
        
        await Promise.all(emojis.map(async v => (msg ? await msg.react(v) : ""))).catch(async err => {
            let channel = msg.channel;
            await msg.delete();

            console.log(err);
    
            await channel.send("Something went wrong. Please make sure you are using valid emojis");
        });
    
        pollCollect(msg, {});
    }
};