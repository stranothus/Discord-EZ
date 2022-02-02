import { Permissions } from "discord.js";
import isAdmin from "../utils/isAdmin.mjs";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("welcome")
        .setDescription("Should I send a welcome message when a new user joins?")
        .addBooleanOption(option => option
            .setName("welcome")
            .setDescription("To send or not to send")
            .setRequired(true)
        ),
    description: `welcome [true/false]\*\` Should I send a welcome message when a new user joins?`,
    category: "settings",
    DMs: false,
    execute: async function(interaction) {
        const welcome = interaction.options.getBoolean("welcome");
    
        if(!isAdmin(interaction)) return;
    
        DB.Guilds.collection("Info").updateOne({ "id": interaction.guild.id }, { "$set": { "welcome": welcome }}, () => {});

        interaction.reply(`Welcome messages have been set to ${welcome ? "on" : "off"}`);
    },
    executeText: async function(msg, args) {
        const welcome = args[0] === "true";
    
        if(!isAdmin(msg)) return;
    
        DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id }, { "$set": { "welcome": welcome }}, () => {});

        msg.channel.send(`Welcome messages have been set to ${welcome ? "on" : "off"}`);
    }
};