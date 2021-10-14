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
                if(!args[0]) {
                    msg.channel.send("Use `=help kauser` to learn how to use this command");
                    return;
                }
                var endpoint = `${KAAPI}/user/profile?${/kaid/.test(args[0]) ? "kaid" : "username"}=${args[0]}&format=pretty`;
                var data = await getJSON(endpoint);
                if(!data) {
                    msg.channel.send("The KA user could not be found. Please double check your query");
                    return;
                }
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
                if(!args[0]) {
                    msg.channel.send("Use `=help kaporgram` to learn how to use this command");
                    return;
                }
                var endpoint = `${KAAPI}/scratchpads/${args[0]}?format=pretty`;
                var data = await fetch(endpoint).then(response => response.json()).then(data => { return data; });
                if(!data) {
                    msg.channel.send("The KA program could not be found. Please double check your query");
                    return;
                }
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
                if(!args[0]) {
                    msg.channel.send("Use `=help define` to learn how to use this command");
                    return;
                }
                var endpoint = `${DictAPI}/${args[0]}`;
                var data = await fetch(endpoint).then(response => response.json()).then(data => { return data; });
                if(!data[0].meanings) {
                    msg.channel.send("The word definition could not be found. Please double check your query");
                    return;
                }
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
                if(!args[0]) {
                    msg.channel.send("Use `=help pronounce` to learn how to use this command");
                    return;
                }
                var results = await ytsr(`Pronounce ${args[0]}`, { limit:  1 });
                if(!results.items) {
                    msg.channel.send("That word's pronunciation could not be found. Please double check your query");
                    return;
                }
                msg.channel.send(results.items[0].url);
            break;
            case "translate":
                var argsL = args.length,
                    text,
                    from;
                
                if(!argsL) {
                    msg.channel.send("Use `=help translate` to learn how to use this command");
                    return;
                }
                
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
            case "help":
                var message = "";
                if(args.length) {
                    switch(args[0]) {
                        case "ping":
                            // tell how =ping works
                            message = `\`=ping\` makes me respond with \`Pong!\``;
                        break;
                        case "kauser":
                            // tell how =kauser works
                            message = `\`=kauser [username or kaid]\` makes me respond with the corresponding Khan Academy user information`;
                        break;
                        case "kaprogram":
                            // tell how =kaprogram works
                            message = `\`=kauser [program ID]\` makes me respond with the corresponding Khan Academy program information`;
                        break;
                        case "define":
                            // tell how =define works
                            message = `\`=define [word]\` makes me give a definition or set of definitions for a word`;
                        break;
                        case "pronounce":
                            // tell how =pronounce works
                            message = `\`=pronounce [word]\` makes me link a YoutTube video of how to pronounce your word`;
                        break;
                        case "translate":
                            // tell how =translate works
                            message = `\`=translate [langauge]* [word(s)]\` makes me translate your word(s) into English. You can optionally specify a language`
                        break;
                    }
                } else {
                    // send list of all commands with basic description
                    message = `
                        Ask for help with any of my commands!\n
                        \`ping\`\n
                        \`kauser\`\n
                        \`kaprogram\`\n
                        \`define\`\n
                        \`pronounce\`\n
                        \`translate\`\n`;
                }

                var embed = new MessageEmbed()
                    .setColor("#C0FA00")
                    .setTitle("**" + (args[0] || "My commands") + "**")
                    .setDescription(message);

                msg.channel.send({ "embeds": [embed] });
            break;
            default:
                msg.channel.send("You can check my commands using =help");
        }
    }
});

client.login(token);