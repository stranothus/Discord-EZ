import isAdmin from "../../utils/isAdmin.mjs";
import unmute from "../../unmute.mjs";
import muterole from "../../utils/mutrole.mjs";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Mute a member for a certain amount of time")
        .addUserOption(option => option
            .setName("user")
            .setDescription("the user to mute")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("time")
            .setDescription("the time for the user to remian muted")
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName("reason")
            .setDescription("the reason for the mute")
            .setRequired(false)
        ),
    description: `mute [user] [time]\* [reason]\*\` makes me mute a user for \`[time]\` of format \`[number][unit of time]\` or a default of one week`,
    category: "moderation",
    DMs: false,
    execute: async function(interaction) {
        if(!isAdmin(msg)) return;
    
        let user = interaction.options.getUser("user");
        let time = interaction.options.getString("time") || "1week";
        let reason = interaction.options.getString("reason") || "Because I can";
    
        let mutedRole = await muterole(interaction.guild);
        user.roles.add(mutedRole);
    
        interaction.reply(`<@!${user.id}> has been muted for ${time} "${reason}"`);
    
        let timeUnit = {
            "s": 1,
            "sec": 1,
            "secs": 1,
            "second": 1,
            "seconds": 1,
            "m": 60,
            "min": 60,
            "mins": 60,
            "minute": 60,
            "minutes": 60,
            "h": 60 * 60,
            "hour": 60 * 60,
            "hours": 60 * 60,
            "d": 60 * 60 * 24,
            "day": 60 * 60 * 24,
            "days": 60 * 60 * 24,
            "w": 60 * 60 * 24 * 7,
            "week": 60 * 60 * 24 * 7,
            "weeks": 60 * 60 * 24 * 7
        }[time.replace(/\d/g, "")] || 60 * 60 * 24 * 7;
    
        let timeTotal = timeUnit * 1000 * (Number(time.replace(/\D/g, "")) || 1);
        let timeNow = new Date().getTime();
    
        let unmuteTime = timeTotal + timeNow;
    
        DB.Guilds.collection("Info").updateOne({ "id": interaction.guild.id, "members.id": user.id }, { "$set": { "members.$.muted": unmuteTime }}, (err, results) => {});
    
        unmute(user, mutedRole, timeTotal, interaction.guild);
    },
    executeText: async function(msg, args) {
        let prefix = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix;
    
        if(!isAdmin(msg)) return;
    
        let user = args[0];
        if(!user || !/\d{17,19}/.test(user)) {
            msg.channel.send("Use `" + prefix + "help mute` to learn how to use this command");
            return;
        }
        let userId = user.replace(/\D/g, "");
        let time = args[1] || "1week";
        let reason = args[2] || "Because I can";
    
        let muted = msg.guild.members.cache.find(v => v.user.id == userId);
        if(!muted) {
            msg.channel.send("This command only works on current server members");
            return;
        }
    
        let mutedRole = await muterole(msg.guild);
        muted.roles.add(mutedRole);
    
        msg.channel.send(`<@!${userId}> has been muted for ${time} "${reason}"`);
    
        let timeUnit = {
            "s": 1,
            "sec": 1,
            "secs": 1,
            "second": 1,
            "seconds": 1,
            "m": 60,
            "min": 60,
            "mins": 60,
            "minute": 60,
            "minutes": 60,
            "h": 60 * 60,
            "hour": 60 * 60,
            "hours": 60 * 60,
            "d": 60 * 60 * 24,
            "day": 60 * 60 * 24,
            "days": 60 * 60 * 24,
            "w": 60 * 60 * 24 * 7,
            "week": 60 * 60 * 24 * 7,
            "weeks": 60 * 60 * 24 * 7
        }[time.replace(/\d/g, "")] || 60 * 60 * 24 * 7;
    
        let timeTotal = timeUnit * 1000 * (Number(time.replace(/\D/g, "")) || 1);
        let timeNow = new Date().getTime();
    
        let unmuteTime = timeTotal + timeNow;
    
        DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id, "members.id": userId }, { "$set": { "members.$.muted": unmuteTime }}, (err, results) => {});
    
        unmute(muted, mutedRole, timeTotal, msg.guild);
    }
};