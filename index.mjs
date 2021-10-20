// import general packages
import { Client, Intents, MessageEmbed, MessageAttachment, Permissions } from "discord.js";
import { MongoClient } from "mongodb";
import dotenv       from "dotenv";
import fetch        from "node-fetch";

// import command packages
import ytsr         from "ytsr";
import translatte   from "translatte";

// import utils
import getJSON      from "./utils/getJSON.mjs";
import dateToObj    from "./utils/dateToObj.js";
import timeSince    from "./utils/timeSince.js";
import deQuote      from "./utils/deQuote.mjs";
import reactRole    from "./commands/reactrole/collect.mjs";
import pollCollect  from "./commands/poll/collect.mjs";
import unmute       from "./commands/mute/unmute.mjs";

// import commands
import clear        from "./commands/clear/clear.mjs";
import clearall     from "./commands/clear/clearall.mjs";
import define       from "./commands/lignuistic/define.mjs";
import diebot       from "./commands/clear/diebot.mjs";
import help         from "./commands/help.mjs";
import kaprogram    from "./commands/ka/kaprogram.mjs";
import kauser       from "./commands/ka/kauser.mjs";
import ping         from "./commands/ping.mjs";
import pronounce    from "./commands/lignuistic/pronounce.mjs";
import reactrole    from "./commands/reactrole/index.mjs";
import translate    from "./commands/lignuistic/translate.mjs";
import poll         from "./commands/poll/index.mjs";
import mute         from "./commands/mute/mute.mjs";

// initiate packages
dotenv.config();

global.DB = {};
const DBConnected = new Promise((resolve, reject) => {
    MongoClient.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.omeul.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        (err, db) => {
            if(err) console.error(err);

            DB = {
                DB: db,
                Guilds: db.db("Guilds")
            };

            resolve(db);
        }
    );
});

const client = new Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MEMBERS",
        "DIRECT_MESSAGES"
    ]
});

// some general variables
const token = process.env.TOKEN;
global.KAAPI = "https://www.khanacademy.org/api/internal";
global.DictAPI = "https://api.dictionaryapi.dev/api/v2/entries/en";

// bot startup
client.once("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);

    const guilds = client.guilds.cache.map(guild => guild.id);

    DBConnected.then(() => {
        guilds.forEach(guildID => {
            DB.Guilds.collection("Info").findOne({ "id": guildID }, async function(err, result) {
                if(err) console.error(err);

                if(result) {
                    for(let i = 0; i < result.reactroles.length; i++) {
                        let index = result.reactroles[i];
                        let guild = client.guilds.cache.get(guildID);
                        let channel = guild.channels.cache.get(index.channelID);
                        let message = await channel.messages.fetch(index.messageID).catch(err => { return false; });

                        if(message) {
                            let roles = index.reacttorole.map(v => v.role);
                            let reactions = index.reacttorole.map(v => v.emoji);

                            reactRole(message, roles, reactions);
                        }
                    }
                    for(let i = 0; i < result.polls.length; i++) {
                        let index = result.polls[i];
                        let guild = client.guilds.cache.get(guildID);
                        let channel = guild.channels.cache.get(index.channelID);
                        let message = await channel.messages.fetch(index.messageID).catch(err => { return false; });

                        if(message) {
                            pollCollect(message, index.reactions);
                        }
                    }

                    let mutedRole = result.moderation.muteRole;

                    for(let i = 0; i < result.members.length; i++) {
                        let index = result.members[i];
                        if(index.muted) {
                            let guild = client.guilds.cache.get(guildID);
                            let mutedUser = await guild.members.fetch(index.id);
                            let timeMuted = index.muted - new Date().getTime();

                            unmute(mutedUser, mutedRole, timeMuted, guild);
                        }
                    }
                }
            });
        });
    });
});

// guild startup
client.on("guildCreate", async guild => {
    // handle DB creation
    let members = await guild.members.fetch();
    let muteRole = await guild.roles.cache.find(x => /muted/i.test(x.name)) || await guild.roles.create({ name: "Muted", permissions: [] });

    guild.channels.cache.forEach(channel => {
        channel.permissionOverwrites.create(muteRole, {
            "SEND_MESSAGES": false,
            "ADD_REACTIONS": false
        });
    })

    DB.Guilds.collection("Info").insertOne({
        "id": guild.id,
        "name": guild.name,
        "members": members.map(v => !v.user.bot ? {
            "id": v.user.id,
            "muted": false
        } : false).filter(v => v),
        "reactroles": [],
        "polls": [],
        "bannedwords": [],
        "moderation": {
            "spamcap": false,
            "ignorespam": [],
            "mutes": [],
            "infractions": [],
            "muteRole": muteRole.id
        }
    }, function(err, result) {
        if(err) console.error(err);
    });
});

// guild remove
client.on("guildDelete", async guild => {
    DB.Guilds.collection("Info").deleteOne({ id: guild.id });
})

// commands
client.on("messageCreate", async msg => {
    if(msg.content.startsWith("=")) {
        var command = msg.content.split(" ")[0].replace(/^=/, "");
        var args = msg.content.split(/("[^"]*")|\s+/).slice(1).filter(v => v).map(v => deQuote(v));

        switch(command.toLowerCase()) {
            case "ping":
                ping(msg, args);
            break;
            case "kauser":
                kauser(msg, args);
            break;
            case "kaprogram":
                kaprogram(msg, args);
            break;
            case "define":
                define(msg, args);
            break;
            case "pronounce":
                pronounce(msg, args);
            break;
            case "translate":
                translate(msg, args);
            break;
            case "reactrole":
                reactrole(msg, args);
            break;
            case "poll":
                poll(msg, args);
            break;
            case "diebot":
                diebot(msg, args);
            break;
            case "clear":
                clear(msg, args);
            break;
            case "clearall":
                clearall(msg, args);
            break;
            case "mute":
                mute(msg, args);
            break;
            case "help":
                help(msg, args);
            break;
            default:
                msg.channel.send("You can check my commands using =help");
        }
    }
});

// start bot
client.login(token);