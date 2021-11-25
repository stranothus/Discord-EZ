import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("status")
        .setDescription("Set the bot status")
        .addStringOption(option => option
            .setName("status")
            .setDescription("online, dnd, idle, or offline")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("type")
            .setDescription("PLAYING, WATCHING, or STREAMING")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("activity")
            .setDescription("the activity the bot is doing")
            .setRequired(true)
        ),
    description: false,
    category: false,
    DMs: true,
    execute: function(interaction) {
        if(interaction.author.id !== "653742791838662687") {
            interaction.reply({ content: "Only my master can use this command", ephemeral: true });
            return;
        }

        let status = interaction.options.getString("status");
        let type = interaction.options.getString("type");
        let activity = interaction.options.getString("activity");
    
        client.user.setPresence({ activities: [{ name: activity, type: type }], status: status });
    },
    executeText: function(msg, args) {
        if(msg.author.id !== "653742791838662687") {
            msg.channel.send("Only my master can use this command");
            return;
        }
    
        client.user.setPresence({ activities: [{ name: args[0] || "Doing lots of nothing", type: args[2] || "PLAYING" }], status: args[1] || "online" });
    }
};