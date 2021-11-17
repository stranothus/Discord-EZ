import muterole from "../utils/mutrole.mjs";

async function channelCreate(channel) {
    let muteRole = await muterole(channel.guild);

    if(channel.type === "GUILD_TEXT" || channel.type === "GUILD_VOICE") {
        channel.permissionOverwrites.create(mutedRole, {
            "SEND_MESSAGES": false,
            "ADD_REACTIONS": false,
            "SEND_MESSAGES_IN_THREADS": false,
            "CREATE_PUBLIC_THREADS": false,
            "CREATE_PRIVATE_THREADS": false
        });
    }
}

export default channelCreate;