import { MessageEmbed } from "discord.js";
import getJSON from "../getJSON.mjs";
import dateToObj from "../dateToObj.js";
import timeSince from "../timeSince.js";

async function kauser(msg, args) {
    if(!args[0]) {
        msg.channel.send("Use `=help kauser` to learn how to use this command");
        return;
    }

    let endpoint = `${KAAPI}/user/profile?${/kaid/.test(args[0]) ? "kaid" : "username"}=${args[0]}&format=pretty`;
    let data = await getJSON(endpoint);

    if(!data) {
        msg.channel.send("The KA user could not be found. Please double check your query");
        return;
    }

    let joinedObj = dateToObj(data.dateJoined ? new Date(data.dateJoined) : new Date());
    let sinceJoined = timeSince(joinedObj) || "Secret";

    let embed = new MessageEmbed()
        .setColor("#FAC000")
        .setTitle("**" + data.nickname + "**")
        .setURL("https://www.khanacademy.org/profile/" + data.kaid)
        .setDescription(`
            **@${data.username}** - ${data.bio}\n
            **Joined:** ${sinceJoined}
            **Energy Points:** ${Number(data.points).toLocaleString()}
            **Videos Completed:** ${Number(data.countVideosCompvared).toLocaleString()}
            **KAID:** ${data.kaid}
            **Full data:** ${endpoint}`);

    msg.channel.send({ "embeds": [embed] });
}

export default kauser;