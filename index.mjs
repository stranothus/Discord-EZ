import { Client, Intents, MessageEmbed } from "discord.js";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"] });

const token = process.env.TOKEN;

const api = "https://www.khanacademy.org/api/internal"

client.once("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async msg => {
    if(msg.content.startsWith("=")) {
        let command = msg.content.split(" ")[0].replace(/^=/, "");
        let args = msg.content.split(" ").slice(1);
        switch(command.toLowerCase()) {
            case "ping":
                msg.channel.send("Pong!");
            break;
            case "kauser":
                let endpoint = `${api}/user/profile?${/kaid/.test(args[0]) ? "kaid" : "username"}=${args[0]}&format=pretty`;
                let data = await fetch(endpoint).then(response => response.json()).then(data => { return data; });
                let embed = new MessageEmbed()
                    .setColor("#FAC000")
                    .setTitle("**" + data.nickname + "**")
                    .setURL("https://www.khanacademy.org/profile/" + data.kaid)
                    .setDescription("**@" + data.username + "** - " + data.bio + "\n\n**Date Joined:** " + data.dateJoined + "\n**Energy Points:** " + data.points + "\n**Videos Completed:** " + data.countVideosCompleted + "\n**KAID:** " + data.kaid + "\n**Full data:** " + endpoint)
                    .setThumbnail(data.avatarSrc);

                msg.channel.send({ "embeds": [embed] });
            break;
            default:
                msg.channel.send("You can check my commands using =help");
        }
    }
});

client.login(token);