import { Client, Intents, MessageEmbed } from "discord.js";
import imageToBase64 from "image-to-base64";
import dotenv from "dotenv";
import fetch from "node-fetch";
import dateToObj from "./dateToObj.js";
import timeSince from "./timeSince.js";

dotenv.config();

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"] });

const token = process.env.TOKEN;

const api = "https://www.khanacademy.org/api/internal"

client.once("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async msg => {
    if(msg.content.startsWith("=")) {
        var command = msg.content.split(" ")[0].replace(/^=/, "");
        var args = msg.content.split(" ").slice(1);
        switch(command.toLowerCase()) {
            case "ping":
                msg.channel.send("Pong!");
            break;
            case "kauser":
                var endpoint = `${api}/user/profile?${/kaid/.test(args[0]) ? "kaid" : "username"}=${args[0]}&format=pretty`;
                var data = await fetch(endpoint).then(response => response.json()).then(data => { return data; });
                var joinedObj = dateToObj(data.dateJoined ? new Date(data.dateJoined) : new Date());
                var sinceJoined = timeSince(joinedObj) || "Secret";
                var embed = new MessageEmbed()
                    .setColor("#FAC000")
                    .setTitle("**" + data.nickname + "**")
                    .setURL("https://www.khanacademy.org/profile/" + data.kaid)
                    .setDescription("**@" + data.username + "** - " + data.bio + "\n\n**Joined:** " + sinceJoined + "\n**Energy Points:** " + Number(data.points).toLocaleString() + "\n**Videos Compvared:** " + Number(data.countVideosCompvared).toLocaleString() + "\n**KAID:** " + data.kaid + "\n**Full data:** " + endpoint);

                msg.channel.send({ "embeds": [embed] });
            break;
            case "kaprogram":
                var endpoint = `${api}/scratchpads/${args[0]}?format=pretty`;
                var data = await fetch(endpoint).then(response => response.json()).then(data => { return data; });
                var authorEndpoint = `${api}/user/profile?kaid=${data.kaid}&format=pretty`;
                var authorData = await fetch(authorEndpoint).then(response => response.json()).then(data => { return data; });
                var createdObj = dateToObj(data.created ? new Date(data.created) : new Date());
                var sinceCreated = timeSince(createdObj);
                var embed = new MessageEmbed()
                    .setColor("#FAC000")
                    .setTitle("**" + data.title + "** (" + data.userAuthoredContentType.toUpperCase() + ")")
                    .setURL("https://www.khanacademy.org/profile/" + data.kaid)
                    .setDescription("**[" + authorData.nickname + "](https://www.khanacademy.org/profile/" + authorData.username + ") - @" + authorData.username + "**\n\n**Created:** " + sinceCreated + "\n**Votes:** " + Number(data.sumVotesIncremented || 1).toLocaleString() + "\n**Spin-offs:** " + Number(data.spinoffCount || 0).toLocaleString() + "\n**Flags:** " + JSON.stringify(data.flags) + "\n**Hidden from HotList:** " + JSON.stringify(data.hideFromHotlist) + "\n**Guardian approved:** " + JSON.stringify(data.definitelyNotSpam) + "\n**Child program:** " + JSON.stringify(data.byChild) + "\n**Full data:** " + endpoint)
                    .setThumbnail(data.imageUrl)

                msg.channel.send({ "embeds": [embed] });
            break;
            default:
                msg.channel.send("You can check my commands using =help");
        }
    }
});

client.login(token);