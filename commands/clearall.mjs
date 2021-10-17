import { Permissions } from "discord.js";

function clearall(msg, args) {
    if(!msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        msg.channel.send("You do not have the permissions to use this command");
    }

    msg.channel.clone();
    msg.channel.delete();
}

export default clearall;