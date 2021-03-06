import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Get a user's avatar or your own")
        .addUserOption(option => option
            .setName("user")
            .setDescription("the user who's avatar will be displayed")
            .setRequired(false)
        ),
    description: `avatar [user]\*\` I'll send a larger picture of your avatar or the user mentioned in the command`,
    category: "misc",
    DMs: false,
    execute: function(interaction) {
        let user = interaction.options.getUser("user") || interaction.member.user;
    
        interaction.reply({ embeds: [
            new MessageEmbed()
                .setTitle(user.username + "'s Avatar")
                .setImage(user.avatarURL(true))
        ], ephemeral: false });
    },
    executeText: function(msg, args) {
        let user = args.length ? /\d{17,19}/.test(args[0]) ? msg.guild.members.cache.find(v => v.user.id == args[0].match(/\d{17,19}/)[0]).user : undefined : msg.author;
    
        if(!user) {
            msg.channel.send("Could not find an avatar for " + args[0]);
            return;
        }
    
        msg.channel.send({ embeds: [
            new MessageEmbed()
                .setTitle(user.username + "'s Avatar")
                .setImage(user.avatarURL(true))
        ]});
    }
};