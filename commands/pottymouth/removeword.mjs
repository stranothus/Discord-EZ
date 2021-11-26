import isAdmin from "../../utils/isAdmin.mjs";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("removeword")
        .setDescription("Remove a banned word")
        .addStringOption(option => option
            .setName("word")
            .setDescription("the word to remove")
            .setRequired(true)
        ),
    description: `removeword [word]\` make me remove a word from a list of censored words`,
    category: "moderation",
    DMs: false,
    execute: async function(interaction) {
        if(!isAdmin(interaction)) return;
    
        let word = interaction.options.getString("word");

        DB.Guilds.collection("Info").updateOne({ "id": interaction.guild.id }, { "$pull": { "bannedwords": word.toLowerCase() }}, function(err, result) {
            if(err) console.error(err);
    
            if(result) {
                interaction.reply(`${word} removed from banned words`);
            } else {
                interaction.reply({ content: `There was an error in the operation`, ephemeral: true });
            }
        });
    },
    executeText: async function(msg, args) {
        let prefix = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix;
    
        if(!isAdmin(msg)) return;
    
        if(!args[0]) {
            msg.channel.send("Use `" + prefix + "help removeword` to learn how to use this command");
            return;
        }
        DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id }, { "$pull": { "bannedwords": args[0].toLowerCase() }}, function(err, result) {
            if(err) console.error(err);
    
            if(result) {
                msg.channel.send(`${args[0]} removed from banned words`);
            } else {
                msg.channel.send(`There was an error in the operation`);
            }
        });
    }
};