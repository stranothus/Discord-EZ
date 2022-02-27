import isAdmin from "../utils/isAdmin.mjs";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("persistroles")
        .setDescription("Should I add old roles back to rejoining members?")
        .addBooleanOption(option => option
            .setName("persistroles")
            .setDescription("To persist or not to persist")
            .setRequired(true)
        ),
    description: `persistroles [true/false]\*\` Should I add old roles back to rejoining members?`,
    category: "settings",
    DMs: false,
    execute: async function(interaction) {
        const persist = interaction.options.getBoolean("welcome");
    
        if(!isAdmin(interaction)) return;
    
        await DB.Guilds.collection("Info").updateOne({ "id": interaction.guild.id }, { "$set": { "persistroles": persist }}, () => {});

        await interaction.reply(`Persist roles have been set to ${persist ? "on" : "off"}`);
    },
    executeText: async function(msg, args) {
        const persist = args[0] === "true";
    
        if(!isAdmin(msg)) return;
    
        await DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id }, { "$set": { "persistroles": persist }}, () => {});

        await msg.channel.send(`Persist roles have been set to ${persist ? "on" : "off"}`);
    }
};