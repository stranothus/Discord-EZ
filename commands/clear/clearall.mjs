import { SlashCommandBuilder } from "@discordjs/builders";
import isAdmin from "../../utils/isAdmin.mjs";

function clearall(msg, args) {
    if(!isAdmin(msg)) return;

    msg.channel.clone();
    msg.channel.delete();
}

export default {
    data: new SlashCommandBuilder()
        .setName("clearall")
        .setDescription("Deletes all messages in a channel"),
    description: `clearall\` makes me delete *every single message in the channel*. Use this command with caution!`,
    category: "pruning",
    DMs: false,
    execute: function(interaction) {
        if(!isAdmin(interaction)) return;
    
        interaction.channel.clone();
        interaction.channel.delete();
    },
    executeText: function(msg, args) {
        if(!isAdmin(msg)) return;
    
        msg.channel.clone();
        msg.channel.delete();
    }
};