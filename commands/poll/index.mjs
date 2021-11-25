import pollCollect from "./collect.mjs";
import { SlashCommandBuilder } from "@discordjs/builders";
import deQuote from "../../utils/deQuote.mjs";

export default {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("create a poll for users to vote in")
        .addStringOption(option => option
            .setName("content")
            .setDescription("option emoji option emoji etc")
        ),
    description: `poll [option] [emoji]...\` makes me hold a poll. Users can react with \`[emoji]\` on the message to make me give them \`[role name]\`, but they can only react once, so voting is fair. Options must be contained in quotation marks if spaces are present.
    Optionally, add a final argument at the end. This should be a string of text to format each option off of. Use {option} and {emoji} in the text to be replaced with each option and emoji.`,
    category: "misc",
    DMs: false,
    execute: async function(interaction) {
        let content = interaction.options.getString("content").split(/("[^"]*")|\s+/).filter(v => v).map(v => deQuote(v));
        let format = content.length % 2 ? content[content.length - 1] : false;
    
        if(content.length < 2) {
            interaction.reply({ content: "Malformed command", ephemeral: true });
            return;
        }
        
        if(format) {
            content.pop();
        }
    
        let msgs = content
            .map((v, i, a) => ((i % 2) ? undefined : {
                content: format ? format.replace(/{option}/g, v).replace(/{emoji}/g, a[i + 1]) : `${v} ${a[i + 1]}`,
                emoji: a[i + 1],
                option: v
            }))
            .filter(v => v);
    
        let contents = msgs.map(v => v.content);
        let emojis = msgs.map(v => v.emoji);
        let options = msgs.map(v => v.role);
    
        let msg = await interaction.reply(content.join("\n"));
    
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
};