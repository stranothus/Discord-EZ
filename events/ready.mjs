import guildCreate  from "./guildCreate.mjs";
import reactRole    from "../utils/reactrole.mjs";
import pollCollect  from "../utils/poll.mjs";
import unmute       from "../utils/unmute.mjs";
import reactRoleOne from "../utils/reactroleone.mjs";
import muterole from "../utils/mutrole.mjs";
import clearMjs from "../commands/clear/clear.mjs";
import discord from "discord.js";
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from "dotenv";
import dirFlat from "../utils/dirFlat.mjs";

dotenv.config();

const commands = Promise.all(dirFlat("./commands").map(async v => {
    let imported = await import("./commands/" + v);

    return {
        command: v.replace(/\.[^\.]+$/, ""),
        file: v,
        ...imported
    };
}));

async function ready() {
	console.log(`Logged in as ${client.user.tag}!`);

    await commands;

    console.log("Commands loaded");

    client.commands = new discord.Collection();

    commands.forEach(command => client.commands.set(command.data.name, command));

    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
    
    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: [
                ...commands.map(v => v.data.toJSON())
            ] }
        );
    } catch (error) {
        console.error(error);
    }

    const guilds = client.guilds.cache;

    guilds.forEach(async guild => {
        try {
            await rest.put(
                Routes.applicationGuildCommands(client.user.id, guild.id),
                { body: [
                    ...commands.map(v => v.data.toJSON())
                ] }
            );
        } catch (error) {
            console.error(error);
        }

        DB.Guilds.collection("Info").findOne({ "id": guild.id }, async function(err, result) {
            if(err) console.error(err);

            if(result) {
                // reinitiate reactroles
                for(let i = 0; i < result.reactroles.length; i++) {
                    let index = result.reactroles[i];
                    let channel = guild.channels.cache.get(index.channelID);
                    let message = await channel.messages.fetch(index.messageID).catch(err => { return false; });

                    if(message) {
                        let ids = index.reacttorole.map(v => v.id);
                        let reactions = index.reacttorole.map(v => v.emoji);

                        reactRole(message, ids, reactions);
                    } else {
                        DB.Guilds.collection("Info").updateOne({ "id": guildID }, { "$pull": { "reactroles": { "messageID": index.messageID }}}, (err, result) => {});
                    }
                }
                // reinitiate reactroles
                for(let i = 0; i < result.reactroleones.length; i++) {
                    let index = result.reactroleones[i];
                    let channel = guild.channels.cache.get(index.channelID);
                    let message = await channel.messages.fetch(index.messageID).catch(err => { return false; });

                    if(message) {
                        let ids = index.reacttorole.map(v => v.id);
                        let reactions = index.reacttorole.map(v => v.emoji);
                        
                        reactRoleOne(message, ids, reactions, index.records || []);
                    } else {
                        DB.Guilds.collection("Info").updateOne({ "id": guildID }, { "$pull": { "reactroleones": { "messageID": index.messageID }}}, (err, result) => {});
                    }
                }
                // reinitiate polls
                for(let i = 0; i < result.polls.length; i++) {
                    let index = result.polls[i];
                    let channel = guild.channels.cache.get(index.channelID);
                    let message = await channel.messages.fetch(index.messageID).catch(err => { return false; });

                    if(message) {
                        pollCollect(message, index.reactions);
                    } else {
                        DB.Guilds.collection("Info").updateOne({ "id": guildID }, { "$pull": { "polls": { "messageID": index.messageID }}}, (err, result) => {});
                    }
                }

                // reinitite muted timers
                let mutedRole = await muterole(guild);
                for(let i = 0; i < result.members.length; i++) {
                    let index = result.members[i];
                    if(index.muted) {
                        let mutedUser = guild.members.resolve(index.id);
                        
                        if(!mutedUser) {
                            continue;
                        }

                        let timeMuted = index.muted - new Date().getTime();

                        unmute(mutedUser, mutedRole, timeMuted, guild);
                    }
                }
                guild.channels.cache.forEach(channel => {
                    if(channel.type === "GUILD_TEXT" || channel.type === "GUILD_VOICE") {
                        channel.permissionOverwrites.create(mutedRole, {
                            "SEND_MESSAGES": false,
                            "ADD_REACTIONS": false,
                            "SEND_MESSAGES_IN_THREADS": false,
                            "CREATE_PUBLIC_THREADS": false,
                            "CREATE_PRIVATE_THREADS": false
                        });
                    }
                });
            } else {
                // if the guild has been added while the bot was offline, go through server setup
                let g = client.guilds.cache.get(guild.id);

                guildCreate(g);
            }
        });
    });
}

export default ready;