import { Permissions } from "discord.js";

/**
 * Checks if a message author is an administrator
 * 
 * @typedef {import("discord.js")} Message
 * 
 * @param {Message} msg - the message to check
 * 
 * @returns {boolean} if they are an admin
 */
function isAdmin(msg) {
    if(!msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        msg.channel.send("You do not have the permissions to use this command");
        return false;
    }

    return true;
}

export default isAdmin;