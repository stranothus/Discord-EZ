import { Permissions } from "discord.js";

function addword(msg, args) {
    if(!msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        msg.channel.send("You do not have the permissions to use this command");
        return;
    }
    if(!args[0]) {
        msg.channel.send("Use `=help addword` to learn how to use this command");
        return;
    }
    DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id }, { "$push": { "bannedwords": args[0] }}, function(err, result) {
        if(err) console.error(err);

        if(result) {
            msg.channel.send(`||${args[0]}|| added to banned words`);
        } else {
            msg.channel.send(`There was an error in the operation`);
        }
    });
}

export default addword;