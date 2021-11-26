import isAdmin from "../../utils/isAdmin.mjs";
import reactRole from "./collect.mjs";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("reactrole")
        .setDescription("Create a post users can react to in order to get roles")
        .addStringOption(option => option
            .setName("content")
            .setDescription("role emoji role emoji etc")
        ),
    description: `reactrole [role name] [emoji]...\` makes me make a reaction role. Users can react with \`[emoji]\` on the message to make me give them \`[role name]\`.
    Don't worry if the role doesn't exist, I'll make it for you! Multiple reaction roles can be included in one message by repeating the format. Roles must be contained in quotation marks if spaces are present.
    Optionally, add a final argument at the end. This should be a string of text to format each option off of. Use {role} and {emoji} in the text to be replaced with each role and emoji.`,
    category: "roles",
    DMs: false,
    execute: async function(interaction) {
        if(!isAdmin(msg)) return;

        let content = interaction.options.getString("content").split(/("[^"]*")|\s+/).filter(v => v).map(v => deQuote(v));
        let format = content.length % 2 ? content[content.length - 1] : false;
    
        if(format) {
            content.pop();
        }
    
        let msgs = content
            .map((v, i, a) => ((i % 2) ? undefined : {
                content: format ? format.replace(/{role}/g, "<@&" + v + ">").replace(/{emoji}/g, a[i + 1]) : `To get <@&${v}>, react with ${a[i + 1]}`,
                emoji: a[i + 1],
                role: v,
                id: undefined
            }))
            .filter(v => v);
    
        let contents = msgs.map(v => v.content);
        let emojis = msgs.map(v => v.emoji);
        let roles = msgs.map(v => v.role);
        let ids = msgs.map(v => v.id);
        
        let stuff = await Promise.all(roles.map(async (v, i) => {
            let role = interaction.guild.roles.cache.find(x => x.name === v) || await interaction.guild.roles.create({ name: v });
    
            contents[i] = format ? format.replace(/{role}/g, `<@&${role.id}>`).replace(/{emoji}/g, emojis[i]) : `To get <@&${role.id}>, ` + `react with ${emojis[i]}`;
            ids[i] = role.id;
            msgs[i].id = role.id
    
            return role;
        }));
    
        let msg = await interaction.reply(content.join("\n"));
    
        DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id }, { "$push": { "reactroles": {
            messageID: msg.id,
            channelID: msg.channel.id,
            reacttorole: msgs.map(v => ({
                id: v.id,
                emoji: v.emoji
            }))
        }}}, function(err, result) {
            if(err) console.error(err);
        });
        
        emojis.forEach(v => (msg ? msg.react(v).catch(err => {
            let channel = msg.channel;
            msg.delete();
    
            interaction.reply({ content: "Something went wrong. Please make sure you are using valid emojis", ephemeral: true });
        }) : ""));
    
        
        let reactions = msgs.map(v => v.emoji);
    
        reactRole(msg, ids, emojis);
    },
    executeText: async function(msg, args) {
        let prefix = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix;
    
        if(!isAdmin(msg)) return;
    
        if(args.length < 2) {
            msg.channel.send("Use `" + prefix + "help reactrole` to learn how to use this command");
            return;
        }
    
        let format = args.length % 2 ? args[args.length - 1] : false;
    
        if(format) {
            args.pop();
        }
    
        let msgs = args
            .map((v, i, a) => ((i % 2) ? undefined : {
                content: format ? format.replace(/{role}/g, "<@&" + v + ">").replace(/{emoji}/g, a[i + 1]) : `To get <@&${v}>, react with ${a[i + 1]}`,
                emoji: a[i + 1],
                role: v,
                id: undefined
            }))
            .filter(v => v);
    
        let content = msgs.map(v => v.content);
        let emojis = msgs.map(v => v.emoji);
        let roles = msgs.map(v => v.role);
        let ids = msgs.map(v => v.id);
        
        let stuff = await Promise.all(roles.map(async (v, i) => {
            let role = msg.guild.roles.cache.find(x => x.name === v) || await msg.guild.roles.create({ name: v });
    
            content[i] = format ? format.replace(/{role}/g, `<@&${role.id}>`).replace(/{emoji}/g, emojis[i]) : `To get <@&${role.id}>, ` + `react with ${emojis[i]}`;
            ids[i] = role.id;
            msgs[i].id = role.id
    
            return role;
        }));
    
        msg = await msg.channel.send(content.join("\n"));
    
        DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id }, { "$push": { "reactroles": {
            messageID: msg.id,
            channelID: msg.channel.id,
            reacttorole: msgs.map(v => ({
                id: v.id,
                emoji: v.emoji
            }))
        }}}, function(err, result) {
            if(err) console.error(err);
        });
        
        emojis.forEach(v => (msg ? msg.react(v).catch(err => {
            let channel = msg.channel;
            msg.delete();
    
            channel.send("Something went wrong. Please make sure you are using valid emojis");
        }) : ""));
    
        
        let reactions = msgs.map(v => v.emoji);
    
        reactRole(msg, ids, emojis);
    }
};