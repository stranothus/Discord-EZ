import { Permissions } from "discord.js";

async function infractions(msg, args) {
    if(!msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        msg.channel.send("You do not have the permissions to use this command");
        return;
    }
    
    if(!args[0]) {
        msg.channel.send("Use `=help warn` to learn how to use this command");
        return;
    }

    let user = msg.guild.members.resolve(args[0].replace(/\D/g, ""));

    if(!user) {
        msg.channel.send("User not found");
        return;
    }

    msg.channel.send("**Infractions for <@!" + user.user.id + ">**\n\n`" + (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id})).members.filter(v => v.id === user.user.id)[0].infractions.join("`\n`") + "`");
}

export default infractions;