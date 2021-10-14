import { Client, Intents, MessageEmbed, MessageAttachment } from "discord.js";
import imageToBase64 from "image-to-base64";
import dotenv from "dotenv";
import fetch from "node-fetch";
import ytsr from "ytsr";
import translatte from "translatte";
import getJSON from "./getJSON.mjs";
import dateToObj from "./dateToObj.js";
import timeSince from "./timeSince.js";

dotenv.config();

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"] });

const token = process.env.TOKEN;

const KAAPI = "https://www.khanacademy.org/api/internal"
const DictAPI = "https://api.dictionaryapi.dev/api/v2/entries/en"

client.once("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async msg => {
    if(msg.content.startsWith("=")) {
        var command = msg.content.split(" ")[0].replace(/^=/, "");
        var args = msg.content.split(/("[^"]*")|\s+/).slice(1).filter(v => v);

        switch(command.toLowerCase()) {
            case "ping":
                msg.channel.send("Pong!");
            break;
            case "kauser":
                var endpoint = `${KAAPI}/user/profile?${/kaid/.test(args[0]) ? "kaid" : "username"}=${args[0]}&format=pretty`;
                var data = await getJSON(endpoint);
                var joinedObj = dateToObj(data.dateJoined ? new Date(data.dateJoined) : new Date());
                var sinceJoined = timeSince(joinedObj) || "Secret";
                var embed = new MessageEmbed()
                    .setColor("#FAC000")
                    .setTitle("**" + data.nickname + "**")
                    .setURL("https://www.khanacademy.org/profile/" + data.kaid)
                    .setDescription(`
                        **@${data.username}** - ${data.bio}\n
                        \n
                        **Joined:** ${sinceJoined}\n
                        **Energy Points:** ${Number(data.points).toLocaleString()}\n
                        **Videos Completed:** ${Number(data.countVideosCompvared).toLocaleString()}\n
                        **KAID:** ${data.kaid}\n
                        **Full data:** ${endpoint}`);

                msg.channel.send({ "embeds": [embed] });
            break;
            case "kaprogram":
                var endpoint = `${KAAPI}/scratchpads/${args[0]}?format=pretty`;
                var data = await fetch(endpoint).then(response => response.json()).then(data => { return data; });
                var authorEndpoint = `${api}/user/profile?kaid=${data.kaid}&format=pretty`;
                var authorData = await fetch(authorEndpoint).then(response => response.json()).then(data => { return data; });
                var createdObj = dateToObj(data.created ? new Date(data.created) : new Date());
                var sinceCreated = timeSince(createdObj);
                var embed = new MessageEmbed()
                    .setColor("#FAC000")
                    .setTitle("**" + data.title + "** (" + data.userAuthoredContentType.toUpperCase() + ")")
                    .setURL("https://www.khanacademy.org/profile/" + data.kaid)
                    .setDescription(`
                        **[${authorData.nickname}](https://www.khanacademy.org/profile/${authorData.username}) - @${authorData.username}**\n
                        \n
                        **Created:** ${sinceCreated}\n
                        **Votes:** ${Number(data.sumVotesIncremented || 1).toLocaleString()}\n
                        **Spin-offs:** ${Number(data.spinoffCount || 0).toLocaleString()}\n
                        **Flags:** ${JSON.stringify(data.flags)}\n
                        **Hidden from HotList:** ${data.hideFromHotlist}\n
                        **Guardian approved:** ${data.definitelyNotSpam}\n
                        **Child program:** ${data.byChild}\n
                        **Full data:** ${endpoint}`)
                    .setThumbnail(data.imageUrl)

                msg.channel.send({ "embeds": [embed] });
            break;
            case "define":
                var endpoint = `${DictAPI}/${args[0]}`;
                var data = await fetch(endpoint).then(response => response.json()).then(data => { return data; });
                var message = ``;
                for(let i = 0; i < data[0].meanings.length; i++) {
                    let index = data[0].meanings[i];

                    message += `*${index.partOfSpeech}*:\n\n`;

                    for(let e = 0; e < index.definitions.length; e++) {
                        let endex = index.definitions[e];

                        message += `${endex.definition}\n"${endex.example}"\n\n`;
                    }
                }

                var embed = new MessageEmbed()
                    .setColor("#00C0FA")
                    .setTitle("**" + data[0].word.toUpperCase() + "**")
                    .setDescription(message);

                msg.channel.send({ embeds: [embed]});
            break;
            case "pronounce":
                var results = await ytsr(`Pronounce ${args[0]}`, { limit:  1 });

                msg.channel.send(results.items[0].url);
            break;
            case "translate":
                var argsL = args.length,
                    text,
                    from;
                if(argsL - 1) {
                    from = args[0];
                    text = args[1].substring(1, args[1].length - 1);
                } else {
                    from = "";
                    text = args[0].substring(1, args[0].length - 1);
                }

                translatte(text, { to: 'en' }).then(res => {
                    msg.channel.send(res.text + (from ? "" : ` (translated from ${res.from.language.iso})`));
                }).catch(err => {
                    console.error(err);
                });
            break;
            default:
                msg.channel.send("You can check my commands using =help");
        }
    }
});

client.login(token);