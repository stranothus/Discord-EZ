import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import getJSON from "./../../utils/getJSON.mjs";

export default {
    data: new SlashCommandBuilder()
        .setName("define")
        .setDescription("Show the definition of an English word")
        .addStringOption(option => option
            .setName("word")
            .setDescription("the word to define")
            .setRequired(true)
        ),
    description: `define [word]\` makes me give a definition or set of definitions for a word.`,
    category: "lingusitics",
    DMs: true,
    execute: async function(interaction) {
        let endpoint = `${DictAPI}/${interaction.options.getString("word")}`;
        let data = await getJSON(endpoint);
    
        if(!data[0]) {
            interaction.reply({ content: "The word definition could not be found. Please double check your query", ephemeral: true });
            return;
        }
    
        let message = ``;
    
        for(let i = 0; i < data[0].meanings.length; i++) {
            let index = data[0].meanings[i];
    
            message += `*${index.partOfSpeech}*:\n\n`;
    
            for(let e = 0; e < index.definitions.length; e++) {
                let endex = index.definitions[e];
    
                message += `${endex.definition}\n"${endex.example}"\n\n`;
            }
        }
    
        let embed = new MessageEmbed()
            .setColor("#00C0FA")
            .setTitle("**" + data[0].word.toUpperCase() + "**")
            .setDescription(message);
    
        interaction.reply({ embeds: [embed]});
    },
    executeText: async function(msg, args) {
        let prefix = msg.guild ? (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix : "{prefix}";
    
        if(!args[0]) {
            msg.channel.send("Use `" + prefix + "help define` to learn how to use this command");
            return;
        }
    
        let endpoint = `${DictAPI}/${args[0]}`;
        let data = await getJSON(endpoint);
    
        if(!data[0]) {
            msg.channel.send("The word definition could not be found. Please double check your query");
            return;
        }
    
        let message = ``;
    
        for(let i = 0; i < data[0].meanings.length; i++) {
            let index = data[0].meanings[i];
    
            message += `*${index.partOfSpeech}*:\n\n`;
    
            for(let e = 0; e < index.definitions.length; e++) {
                let endex = index.definitions[e];
    
                message += `${endex.definition}\n"${endex.example}"\n\n`;
            }
        }
    
        let embed = new MessageEmbed()
            .setColor("#00C0FA")
            .setTitle("**" + data[0].word.toUpperCase() + "**")
            .setDescription(message);
    
        msg.channel.send({ embeds: [embed]});
    }
};