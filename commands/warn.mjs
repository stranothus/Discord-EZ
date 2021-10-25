import { Permissions } from "discord.js";

async function warn(msg, args) {
    if(!msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        msg.channel.send("You do not have the permissions to use this command");
        return;
    }
    
    if(!args[0] || !args[1]) {
        msg.channel.send("Use `=help warn` to learn how to use this command");
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