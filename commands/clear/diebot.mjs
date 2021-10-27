import isAdmin from "../../utils/isAdmin.mjs";

function diebot(msg, args) {
    if(isAdmin(msg)) return;
    
    msg.channel.messages.fetch().then(async messages => {
        let myMessages = messages.filter(msg => msg.author.id === client.user.id);

        await Promise.all(myMessages.map(async myMessage => await myMessage.delete()));

        let messagesDeleted = myMessages.size; // number of messages deleted

        // Logging the number of messages deleted on both the channel and console.
        if(messagesDeleted) {
            msg.channel.send("Deletion of messages successful. Total messages deleted: " + messagesDeleted).then(msg => {
                setTimeout(() => msg.delete(), 5000);
            });
        } else {
            msg = await msg.channel.send("Deletion of messages unsuccessful");
        }
    });
}
export default diebot;