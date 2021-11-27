import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import dirFlat from "../utils/dirFlat.mjs";

const commands = Promise.all(dirFlat("./commands").map(async v => {
    let imported = await import("../" + v);

    return {
        command: v.replace(/\.[^\.]+$/, ""),
        file: v,
        ...imported.default
    };
}));

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Get help with using the different bot commands")
        .addStringOption(option => option
            .setName("command")
            .setDescription("a command or category to get help with")
            .setRequired(false)
        ),
    description: ``,
    DMs: true,
    execute: async function(interaction) {
        let prefix = interaction.guild ? (await DB.Guilds.collection("Info").findOne({ "id": interaction.guild.id })).prefix : "{prefix}";
        let command = interaction.options.getString("command");

        if(command) {
            let index = (await commands).findIndex(v => v.data.name === command);

            if(index + 1) {
                interaction.reply("\`" + prefix + (await commands)[i].description);
            } else {
                let category = (await commands).filter(v => v.category === command);

                if(category.length) {
                    let embed = new MessageEmbed()
                        .setColor("#C0FA00")
                        .setTitle("**" + command + "**")
                        .setDescription("Here are some of my commmands for " + command)
                        .setThumbnail(client.user.avatarURL(true))
                        .addFields(category.map(v => ({
                            name: "Command",
                            value: v.data.name
                        })));
                    
                    interaction.reply({ "embeds": [embed] });
                } else {
                    interaction.reply({ content: "No matching command or category", ephemeral: true });
                }
            }
        } else {
            var embed = new MessageEmbed()
                .setColor("#C0FA00")
                .setTitle("**My commands**")
                .setDescription("Hey there, Discord user! I'm Discord-EZ, a general purpose bot to help with moderation, basic tasks, and fun! Select help with one of my modules below")
                .setThumbnail(client.user.avatarURL(true))
                .addFields(
                    {
                        name: "Syntax guide",
                        value: `\`${prefix}help syntax\``
                    },
                    {
                        name: "Moderation",
                        value: `\`${prefix}help moderation\``
                    },
                    {
                        name: "Webhooks",
                        value: `\`${prefix}help webhooks\``
                    },
                    {
                        name: "Linguistics",
                        value: `\`${prefix}help linguistics\``
                    },
                    {
                        name: "Khan Academy",
                        value: `\`${prefix}help ka\``
                    },
                    {
                        name: "Roles",
                        value: `\`${prefix}help roles\``
                    },
                    {
                        name: "Message pruning",
                        value: `\`${prefix}help pruning\``
                    },
                    {
                        name: "Server settings",
                        value: `\`${prefix}help settings\``
                    },
                    {
                        name: "Miscellaneous",
                        value: `\`${prefix}help misc\``
                    },
                    {
                        name: "About the bot",
                        value: `\`${prefix}help about\``
                    }
                );
        
            interaction.reply({ "embeds": [embed] });
        }
    },
    executeText: async function(msg, args) {
        let prefix = msg.guild ? (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix : "{prefix}";
        let command = args[0];
        
        if(command) {
            let index = (await commands).findIndex(v => v.data.name === command);

            if(index + 1) {
                interaction.reply("\`" + prefix + (await commands)[i].description);
            } else {
                let category = (await commands).filter(v => v.category === command);

                if(category.length) {
                    let embed = new MessageEmbed()
                        .setColor("#C0FA00")
                        .setTitle("**" + command + "**")
                        .setDescription("Here are some of my commmands for " + command)
                        .setThumbnail(client.user.avatarURL(true))
                        .addFields(category.map(v => ({
                            name: "Command",
                            value: v.data.name
                        })));
                    
                    msg.channel.send({ "embeds": [embed] });
                } else {
                    msg.channel.send({ content: "No matching command or category", ephemeral: true });
                }
            }
        } else {
            var embed = new MessageEmbed()
                .setColor("#C0FA00")
                .setTitle("**My commands**")
                .setDescription("Hey there, Discord user! I'm Discord-EZ, a general purpose bot to help with moderation, basic tasks, and fun! Select help with one of my modules below")
                .setThumbnail(client.user.avatarURL(true))
                .addFields(
                    {
                        name: "Syntax guide",
                        value: `\`${prefix}help syntax\``
                    },
                    {
                        name: "Moderation",
                        value: `\`${prefix}help moderation\``
                    },
                    {
                        name: "Webhooks",
                        value: `\`${prefix}help webhooks\``
                    },
                    {
                        name: "Linguistics",
                        value: `\`${prefix}help linguistics\``
                    },
                    {
                        name: "Khan Academy",
                        value: `\`${prefix}help ka\``
                    },
                    {
                        name: "Roles",
                        value: `\`${prefix}help roles\``
                    },
                    {
                        name: "Message pruning",
                        value: `\`${prefix}help pruning\``
                    },
                    {
                        name: "Server settings",
                        value: `\`${prefix}help settings\``
                    },
                    {
                        name: "Miscellaneous",
                        value: `\`${prefix}help misc\``
                    },
                    {
                        name: "About the bot",
                        value: `\`${prefix}help about\``
                    }
                );
        
            msg.channel.send({ "embeds": [embed] });
        }
    }
};