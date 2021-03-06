import { Permissions } from "discord.js";
import muterole from "../utils/mutrole.mjs";

async function channelCreate(channel) {
    if(!channel.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return;

    let muteRole = await muterole(channel.guild);

    if(channel.type === "GUILD_TEXT" || channel.type === "GUILD_VOICE") {
        channel.permissionOverwrites.create(muteRole, {
            "SEND_MESSAGES": false,
            "ADD_REACTIONS": false,
            "SEND_MESSAGES_IN_THREADS": false,
            "CREATE_PUBLIC_THREADS": false,
            "CREATE_PRIVATE_THREADS": false
        });
    }
}

export default channelCreate;