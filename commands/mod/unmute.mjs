import isAdmin from "../../utils/isAdmin.mjs";

async function earlyunmute(msg, args) {
    let prefix = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix;

    if(isAdmin(msg)) return;
    
    let user = args[0];
    if(!user) {
        msg.channel.send("Use `" + prefix + "help mute` to learn how to use this command");
        return;
    }
    let userId = user.replace(/\D/g, "");
    let muted = msg.guild.members.cache.find(v => v.user.id == userId);
    let guild = await DB.Guilds.collection("Info").findOne({ id: msg.guild.id });
    let mutedRole = guild.moderation.muteRole;

    muted.roles.remove(mutedRole);

    DB.Guilds.collection("Info").updateOne({ "id": guild.id, "members.id": muted.id }, { "$set": { "members.$.muted": false }}, (err, results) => {});

    msg.channel.send(`${user} has been unmuted early`);
}

export default earlyunmute;