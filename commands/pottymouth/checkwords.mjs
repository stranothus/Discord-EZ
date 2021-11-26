import { SlashCommandBuilder } from "@discordjs/builders";

async function checkwords(msg) {
    let bannedwords = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).bannedwords;

    if(bannedwords.length) {
        msg.channel.send("Banned words: ||" + bannedwords.join(", ") + "||");
    } else {
        msg.channel.send("You have no banned words");
    }
}

export default {
    data: new SlashCommandBuilder()
        .setName("checkwords")
        .setDescription("Check the list of banned words"),
    description: `checkwords\` I'll send a list of censored words. Make sure to use this in a staff only channel!`,
    category: "moderation",
    DMs: false,
    execute: async function(interaction) {
        let bannedwords = (await DB.Guilds.collection("Info").findOne({ "id": interactions.guild.id })).bannedwords;
    
        if(bannedwords.length) {
            interaction.reply({ content: "Banned words: ||" + bannedwords.join(", ") + "||", ephemeral: true });
        } else {
            interaction.reply({ content: "You have no banned words", ephemeral: true });
        }
    },
    executeText: async function(msg, args) {
        let bannedwords = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).bannedwords;
    
        if(bannedwords.length) {
            msg.channel.send("Banned words: ||" + bannedwords.join(", ") + "||");
        } else {
            msg.channel.send("You have no banned words");
        }
    }
};