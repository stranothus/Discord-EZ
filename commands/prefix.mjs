import { Permissions } from "discord.js";
import isAdmin from "../utils/isAdmin.mjs";
import { SlashCommandBuilder } from "@discordjs/builders";

async function prefix(msg, args) {
    if(!args[0]) {
        msg.channel.send("My prefix is `" + (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix + "`");
        return;
    }

    if(!isAdmin(msg)) return;

    DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id }, { "$set": { "prefix": args[0] }}, () => {});
    msg.channel.send("My prefix is now `" + args[0] + "`");
}

export default {
    data: new SlashCommandBuilder()
        .setName("prefix")
        .setDescription("Set and view the prefix of the server")
        .addStringOption(option => option
            .setName("prefix")
            .setDescription("the new prefix to set")
            .setRequired(false)
        ),
    description: `prefix [new prefix]\*\` I'll state my prefix or set it to a new one!`,
    category: "settings",
    DMs: false,
    execute: async function(interaction) {
        let newPrefix = interaction.options.getString("prefix");

        if(!newPrefix) {
            interaction.reply("My prefix is `" + (await DB.Guilds.collection("Info").findOne({ "id": interaction.guild.id })).prefix + "`");
            return;
        }
    
        if(!isAdmin(interaction)) return;
    
        DB.Guilds.collection("Info").updateOne({ "id": interaction.guild.id }, { "$set": { "prefix": newPrefix }}, () => {});
        interaction.reply("My prefix is now `" + newPrefix + "`");
    },
    executeText: async function(msg, args) {
        if(!args[0]) {
            msg.channel.send("My prefix is `" + (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix + "`");
            return;
        }
    
        if(!isAdmin(msg)) return;
    
        DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id }, { "$set": { "prefix": args[0] }}, () => {});
        msg.channel.send("My prefix is now `" + args[0] + "`");
    }
};