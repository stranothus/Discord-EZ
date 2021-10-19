import { Permissions } from "discord.js";

function clear(msg, args) {
    if(!msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        msg.channel.send("You do not have the permissions to use this command");
    }

    let channel = msg.channel;

    channel.bulkDelete(args[0] || 99, true).then(messages => {
        let messagesDeleted = messages.size; // number of messages deleted

        // Logging the number of messages deleted on both the channel and console.
        if(messagesDeleted) {
            channel.send("Deletion of messages successful. Total messages deleted: " + messagesDeleted).then(msg => {
                setTimeout(() => msg.delete(), 5000);
            });
        } else {
            channel.send("Deletion of messages unsuccessful");
        }
    }).catch(err => {
        channel.send("Deletion of messages unsuccessful");
    });
}

export default clear;