import { SlashCommandBuilder } from "@discordjs/builders";

function invite(msg, args) {
    msg.channel.send("https://discord.com/api/oauth2/authorize?client_id=886933964537880617&permissions=8&scope=bot");
}

export default {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Get my invite to add me to other servers"),
    description: `invite\` makes me give you my invite so you can add me to other servers`,
    category: "about",
    DMs: true,
    execute: function(interaction) {
        interaction.reply("https://discord.com/api/oauth2/authorize?client_id=886933964537880617&permissions=8&scope=bot");
    },
    executeText: function(msg, args) {
        msg.channel.send("https://discord.com/api/oauth2/authorize?client_id=886933964537880617&permissions=8&scope=bot");
    }
};