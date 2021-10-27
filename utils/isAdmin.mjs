import { Permissions } from "discord.js";

function isAdmin(msg) {
    if(!msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        msg.channel.send("You do not have the permissions to use this command");
        return false;
    }

    return true;
}

export default isAdmin;