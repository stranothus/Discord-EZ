const { Client, Intents } = require("discord.js");
const dotenv = require("dotenv");
import fetch from "node-fetch";

dotenv.config();

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"] });

const token = process.env.TOKEN;

const api = "www.khanacademy.org/api/internal"

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
                msg.channel.send(data);
            break;
        }
    }
});

client.login(token);