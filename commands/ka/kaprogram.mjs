import { MessageEmbed } from "discord.js";
import getJSON from "../getJSON.mjs";
import dateToObj from "../dateToObj.js";
import timeSince from "../timeSince.js";

async function kaprogram(msg, args) {
    if(!args[0]) {
        msg.channel.send("Use `=help kaporgram` to learn how to use this command");
        return;
    }

    let endpoint = `${KAAPI}/scratchpads/${args[0]}?format=pretty`;
    let data = await fetch(endpoint).then(response => response.json()).then(data => { return data; });

    if(!data) {
        msg.channel.send("The KA program could not be found. Please double check your query");
        return;
    }

    let authorEndpoint = `${api}/user/profile?kaid=${data.kaid}&format=pretty`;
    let authorData = await fetch(authorEndpoint).then(response => response.json()).then(data => { return data; });
    let createdObj = dateToObj(data.created ? new Date(data.created) : new Date());
    let sinceCreated = timeSince(createdObj);

    let embed = new MessageEmbed()
        .setColor("#FAC000")
        .setTitle("**" + data.title + "** (" + data.userAuthoredContentType.toUpperCase() + ")")
        .setURL("https://www.khanacademy.org/profile/" + data.kaid)
        .setDescription(`
            **[${authorData.nickname}](https://www.khanacademy.org/profile/${authorData.username}) - @${authorData.username}**\n
            **Created:** ${sinceCreated}
            **Votes:** ${Number(data.sumVotesIncremented || 1).toLocaleString()}
            **Spin-offs:** ${Number(data.spinoffCount || 0).toLocaleString()}
            **Flags:** ${JSON.stringify(data.flags)}
            **Hidden from HotList:** ${data.hideFromHotlist}
            **Guardian approved:** ${data.definitelyNotSpam}
            **Child program:** ${data.byChild}
            **Full data:** ${endpoint}`)
        .setThumbnail(data.imageUrl)

    msg.channel.send({ "embeds": [embed] });
}

export default kaprogram;