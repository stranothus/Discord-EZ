import muterole from "../utils/mutrole.mjs";

async function channelCreate(channel) {
    let muteRole = await muterole(channel.guild);

    channel.permissionOverwrites.create(muteRole, {
        "SEND_MESSAGES": false,
        "ADD_REACTIONS": false,
        "SEND_MESSAGES_IN_THREADS": false,
        "CREATE_PUBLIC_THREADS": false,
        "CREATE_PRIVATE_THREADS": false
    });
}

export default channelCreate;