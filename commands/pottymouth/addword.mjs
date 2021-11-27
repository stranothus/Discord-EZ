import isAdmin from "../../utils/isAdmin.mjs";
import { SlashCommandBuilder } from "@discordjs/builders";

async function addword(msg, args) {
    let prefix = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix;

    if(!isAdmin(msg)) return;
    
    if(!args[0]) {
        msg.channel.send("Use `" + prefix + "help addword` to learn how to use this command");
        return;
    }
    DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id }, { "$push": { "bannedwords": args[0].toLowerCase() }}, function(err, result) {
        if(err) console.error(err);

        if(result) {
            msg.channel.send(`||${args[0]}|| added to banned words`);
        } else {
            msg.channel.send(`There was an error in the operation`);
        }
    });
}

export default {
    data: new SlashCommandBuilder()
        .setName("addword")
        .setDescription("Add a banned word")
        .addStringOption(option => option
            .setName("word")
            .setDescription("the word to ban")
            .setRequired(true)
        ),
    description: `addword [word]\` make me add a word to a list of censored words`,
    category: "moderation",
    DMs: false,
    execute: async function(interaction) {
        if(!isAdmin(interaction)) return;

        let word = interaction.options.getString("word");
        
        DB.Guilds.collection("Info").updateOne({ "id": interaction.guild.id }, { "$push": { "bannedwords": word.toLowerCase() }}, function(err, result) {
            if(err) console.error(err);
    
            if(result) {
                interaction.reply({ content: `||${word}|| added to banned words`, ephemeral: true });
            } else {
                interaction.reply({ content: `Something went wrong...`, ephemeral: true });
            }
        });
    },
    executeText: async function(msg, args) {
        let prefix = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix;
    
        if(!isAdmin(msg)) return;
        
        if(!args[0]) {
            msg.channel.send("Use `" + prefix + "help addword` to learn how to use this command");
            return;
        }
        DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id }, { "$push": { "bannedwords": args[0].toLowerCase() }}, function(err, result) {
            if(err) console.error(err);
    
            if(result) {
                msg.channel.send(`||${args[0]}|| added to banned words`);
            } else {
                msg.channel.send(`There was an error in the operation`);
            }
        });
    }
};