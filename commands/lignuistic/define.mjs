import { MessageEmbed } from "discord.js";
import getJSON from "./../../utils/getJSON.mjs";

async function define(msg, args) {
    let prefix = msg.guild ? (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix : "{prefix}";

    if(!args[0]) {
        msg.channel.send("Use `" + prefix + "help define` to learn how to use this command");
        return;
    }

    let endpoint = `${DictAPI}/${args[0]}`;
    let data = await getJSON(endpoint);

    if(!data[0].meanings) {
        msg.channel.send("The word definition could not be found. Please double check your query");
        return;
    }

    let message = ``;

    for(let i = 0; i < data[0].meanings.length; i++) {
        let index = data[0].meanings[i];

        message += `*${index.partOfSpeech}*:\n\n`;

        for(let e = 0; e < index.definitions.length; e++) {
            let endex = index.definitions[e];

            message += `${endex.definition}\n"${endex.example}"\n\n`;
        }
    }

    let embed = new MessageEmbed()
        .setColor("#00C0FA")
        .setTitle("**" + data[0].word.toUpperCase() + "**")
        .setDescription(message);

    msg.channel.send({ embeds: [embed]});
}

export default define;