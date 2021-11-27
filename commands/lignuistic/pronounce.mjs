import { SlashCommandBuilder } from "@discordjs/builders";
import ytsr from "ytsr";

export default {
    data: new SlashCommandBuilder()
        .setName("pronounce")
        .setDescription("Provide a link to a YouTube video to pronounce a word")
        .addStringOption(option => option
            .setName("word")
            .setDescription("the word to pronounce")
            .setRequired(true)
        ),
    description: `pronounce [word]\` makes me link a YouTube video of how to pronounce your word.`,
    category: "linguistics",
    DMs: true,
    execute: async function(interaction) {
        let results = await ytsr(`Pronounce ${args[0]}`, { limit:  1 });
        
        if(!results.items) {
            interaction.reply({ content: "That word's pronunciation could not be found. Please double check your query", ephemeral: true });
            return;
        }
        interaction.reply(results.items[0].url);
    },
    executeText: async function(msg, args) {
        let prefix = msg.guild ? (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix : "{prefix}";
    
        if(!args[0]) {
            msg.channel.send("Use `" + prefix + "help pronounce` to learn how to use this command");
            return;
        }
    
        let results = await ytsr(`Pronounce ${args[0]}`, { limit:  1 });
        
        if(!results.items) {
            msg.channel.send("That word's pronunciation could not be found. Please double check your query");
            return;
        }
        msg.channel.send(results.items[0].url);
    }
};