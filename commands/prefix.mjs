import { Permissions } from "discord.js";
import isAdmin from "../utils/isAdmin.mjs";

async function prefix(msg, args) {
    if(!args[0]) {
        msg.channel.send("My prefix is `" + (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix + "`");
        return;
    }

    if(!isAdmin(msg)) return;

    DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id }, { "$set": { "prefix": args[0] }}, () => {});
    msg.channel.send("My prefix is now `" + args[0] + "`");
}

export default prefix;