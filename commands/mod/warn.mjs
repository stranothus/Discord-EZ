import isAdmin from "../../utils/isAdmin.mjs";

async function warn(msg, args) {
    let prefix = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix;

    if(!isAdmin(msg)) return;
    
    if(!args[0] || !args[1]) {
        msg.channel.send("Use `" + prefix + "help warn` to learn how to use this command");
        return;
    }

    let user = msg.guild.members.resolve(args[0].replace(/\D/g, ""));

    if(!user) {
        msg.channel.send("User not found");
        return;
    }

    msg.channel.send("Infraction recorded");

    DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id, "members.id": user.user.id }, { "$push": { "members.$.infractions": args[1] }}, () => {});
}

export default warn;