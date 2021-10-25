import { Permissions } from "discord.js";

async function prefix(msg, args) {
    if(!args[0]) {
        msg.channel.send("My prefix is `" + (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix + "`");
        return;
    }

    if(!msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        msg.channel.send("You do not have the permissions to use this command");
        return;
    }

    DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id }, { "$set": { "prefix": args[0] }}, () => {});
    msg.channel.send("My prefix is now `" + args[0] + "`");
}

export default prefix;