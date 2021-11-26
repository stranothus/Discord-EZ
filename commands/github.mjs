import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("github")
        .setDescription("Get the link to my GitHub repoisitory"),
    description: ``,
    category: "about",
    DMs: true,
    execute: function(interaction) {
        interaction.reply("https://github.com/stranothus/Discord-EZ");
    },
    executeText: function(msg, args) {
        msg.channel.send("https://github.com/stranothus/Discord-EZ");
    }
};