import { Client, Intents, MessageEmbed, MessageAttachment } from "discord.js";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { MongoClient } from "mongodb";
import imageToBase64 from "image-to-base64";
import ytsr from "ytsr";
import translatte from "translatte";
import getJSON from "./getJSON.mjs";
import dateToObj from "./dateToObj.js";
import timeSince from "./timeSince.js";
import deQuote from "./deQuote.mjs";
import reactRole from "./reactRole.mjs";

dotenv.config();

var DB = {};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.omeul.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const DBConnected = new Promise((resolve, reject) => {
    MongoClient.connect(uri,
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

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MEMBERS"] });

const token = process.env.TOKEN;

const KAAPI = "https://www.khanacademy.org/api/internal"
const DictAPI = "https://api.dictionaryapi.dev/api/v2/entries/en"

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
                        let message = await channel.messages.fetch(index.messageID);

                        let roles = index.reacttorole.map(v => v.role);
                        let reactions = index.reacttorole.map(v => v.emoji);

                        reactRole(message, roles, reactions);
                    }
                }
            });
        });
    });
});

client.on("guildCreate", async guild => {
    // handle DB creation
    let members = await guild.members.fetch();

    DB.Guilds.collection("Info").insertOne({
        id: guild.id,
        name: guild.name,
        members: members.map(v => !v.user.bot ? {
            id: v.user.id,
            muted: false
        } : false).filter(v => v),
        reactroles: [],
        bannedwords: [],
        moderation: {
            spamcap: false,
            ignorespam: [],
            mutes: [],
            infractions: []
        }
    }, function(err, result) {
        if(err) console.error(err);
    });
});

client.on("guildDelete", async guild => {
    DB.Guilds.collection("Info").deleteOne({ id: guild.id });
})

client.on("messageCreate", async msg => {
    if(msg.content.startsWith("=")) {
        var command = msg.content.split(" ")[0].replace(/^=/, "");
        var args = msg.content.split(/("[^"]*")|\s+/).slice(1).filter(v => v).map(v => deQuote(v));

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
                        **Joined:** ${sinceJoined}
                        **Energy Points:** ${Number(data.points).toLocaleString()}
                        **Videos Completed:** ${Number(data.countVideosCompvared).toLocaleString()}
                        **KAID:** ${data.kaid}
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
                    text = args[1];
                } else {
                    from = "";
                    text = args[0];
                }

                translatte(text, { to: 'en' }).then(res => {
                    msg.channel.send(res.text + (from ? "" : ` (translated from ${res.from.language.iso})`));
                }).catch(err => {
                    console.error(err);
                });
            break;
            case "reactrole":
                let msgs = args
                    .map((v, i, a) => ((i % 2) ? undefined : {
                        content: `To get @${v}, ` + `react with ${a[i + 1]}`,
                        emoji: a[i + 1],
                        role: v
                    }))
                    .filter(v => v);

                let content = msgs.map(v => v.content);
                let emojis = msgs.map(v => v.emoji);
                let roles = msgs.map(v => v.role);
                
                let stuff = await Promise.all(roles.map(async (v, i) => {
                    let role = msg.guild.roles.cache.find(x => x.name === v) || await msg.guild.roles.create({ name: v });

                    content[i] = `To get <@&${role.id}>, ` + `react with ${emojis[i]}`;
                    roles[i] = role;

                    return role;
                }));

                msg = await msg.channel.send(content.join("\n"));

                DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id }, { "$push": { "reactroles": {
                    messageID: msg.id,
                    channelID: msg.channel.id,
                    reacttorole: msgs.map(v => ({
                        role: v.role,
                        emoji: v.emoji
                    }))
                }}}, function(err, result) {
                    if(err) console.error(err);
                });
                
                emojis.forEach(v => msg.react(v));

                roles = msgs.map(v => v.role);
                let reactions = msgs.map(v => v.emoji);

                reactRole(msg, roles, emojis);
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
                            message = `\`=translate [langauge]* [word(s)]\` makes me translate your word(s) into English. You can optionally specify a language. Make sure to wrap phrases in quotation marks or I'll only translate the first word`
                        break;
                        case "reactrole":
                            // tell how =reactrole works
                            message = `\`=reactrole [role name] [emoji]...\` makes me a reaction role. Users can react with \`[emoji]\` on the message to make me give them \`[role name]\`. Don't worry if the role doesn't exist, I'll make it for you! Multiple reaction roles can be included in one message by repeating the format. Roles must be contained in quotation marks if spaces are present`
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
                        \`translate\`\n
                        \`reactrole\`\n`;
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