import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("status")
        .setDescription("Set the bot status")
        .addStringOption(option => option
            .setName("status")
            .setDescription("online, dnd, idle, or offline")
            .setRequired(true)
            .addChoices([["Online", "online"], ["Do not disturb", "dnd"], ["Idle", "idle"], ["Invisible", "offline"]])
        )
        .addStringOption(option => option
            .setName("type")
            .setDescription("PLAYING, WATCHING, or STREAMING")
            .setRequired(true)
            .addChoices([["Playing", "PLAYING"], ["Watching", "WATCHING"], ["Streaming", "STREAMING"]])
        )
        .addStringOption(option => option
            .setName("activity")
            .setDescription("the activity the bot is doing")
            .setRequired(true)
        ),
    description: false,
    category: false,
    DMs: true,
    execute: async function(interaction) {
        if(interaction.user.id !== "653742791838662687") {
            await interaction.reply({ content: "Only my master can use this command", ephemeral: true });
            return;
        }

        const status = interaction.options.getString("status");
        const type = interaction.options.getString("type");
        const activity = interaction.options.getString("activity");
    
        await client.user.setPresence({ activities: [{ name: activity, type: type }], status: status });
        
        await interaction.reply({
            content: `Status set to: ${status}\nWith activity: ${activity} (${type})`,
            ephemeral: true
        });
    },
    executeText: async function(msg, args) {
        if(msg.author.id !== "653742791838662687") {
            await msg.channel.send("Only my master can use this command");
            return;
        }

        const status = args[0];
        const type = args[1];
        const activity = args[2];

        await client.user.setPresence({ activities: [{ name: activity || "Doing lots of nothing", type: type || "PLAYING" }], status: status || "online" });

        await msg.channel.send(`Status set to: ${status}\nWith activity: ${activity} (${type})`);
    }
};