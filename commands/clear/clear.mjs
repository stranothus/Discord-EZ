import { SlashCommandBuilder } from "@discordjs/builders";
import isAdmin from "../../utils/isAdmin.mjs";

function clear(msg, args) {
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

export default {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clears a specified number of messages or all messages from the channel it's used in"),
    execute(interaction) {
        interaction.reply("Working on it!")
    }
};