import { SlashCommandBuilder } from "@discordjs/builders";
import isAdmin from "../../utils/isAdmin.mjs";

export default {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clears a specified number of messages or all messages from the channel it's used in")
        .addIntegerOption(option => option
            .setName("todelete")
            .setDescription("The number of messages to delete")
        ),
    description: `clear [number]\*\` makes me delete \`[number]\` messages. If number is not specified, I will delete 99 messages. Older messages might not be deleteable`,
    category: "pruning",
    DMs: false,
    execute: function(interaction) {
        if(!isAdmin(interaction)) return;

        let channel = interaction.channel;

        channel.bulkDelete(interaction.options.getInteger("todelete") || 99, true).then(messages => {
            let messagesDeleted = messages.size; // number of messages deleted
    
            // Logging the number of messages deleted on both the channel and console.
            if(messagesDeleted) {
                interaction.reply({ content: "Deletion of messages successful. Total messages deleted: " + messagesDeleted, ephemeral: true });
            } else {
                interaction.reply({ content: "Deletion of messages unsuccessful", ephemeral: true });
            }
        }).catch(err => {
            interaction.reply({ content: "Deletion of messages unsuccessful", ephemeral: true });
        });
    },
    executeText: function(msg, args) {
        if(!isAdmin(msg)) return;
    
        let channel = msg.channel;
    
        channel.bulkDelete(args[0] || 99, true).then(messages => {
            let messagesDeleted = messages.size; // number of messages deleted
    
            // Logging the number of messages deleted on both the channel and console.
            if(messagesDeleted) {
                channel.send("Deletion of messages successful. Total messages deleted: " + messagesDeleted).then(msg => {
                    setTimeout(() => {
                        if(msg) {
                            msg.delete();
                        }
                    }, 5000);
                });
            } else {
                channel.send("Deletion of messages unsuccessful");
            }
        }).catch(err => {
            channel.send("Deletion of messages unsuccessful");
        });
    }
};