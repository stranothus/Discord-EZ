import isAdmin from "../../utils/isAdmin.mjs";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Umutes a muted user early")
        .addUserOption(option => option
            .setName("user")
            .setDescription("the user to unmute early")
            .setRequired(true)
        ),
    description: `unmute [user]\` make me unmute a muted user early`,
    category: "moderation",
    DMs: false,
    execute: async function(interaction) {
        if(!isAdmin(interaction)) return;
        
        let user = interaction.options.getUser("user");
            user = interaction.guild.members.cache.find(v => v.user.id == user.id);
        let guild = await DB.Guilds.collection("Info").findOne({ id: interaction.guild.id });
        let mutedRole = guild.moderation.muteRole;
    
        user.roles.remove(mutedRole);
    
        DB.Guilds.collection("Info").updateOne({ "id": guild.id, "members.id": user.id }, { "$set": { "members.$.muted": false }}, (err, results) => {});
    
        interaction.reply(`<@!${user.id}> has been unmuted early`);
    },
    executeText: async function(msg, args) {
        let prefix = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix;
    
        if(!isAdmin(msg)) return;
        
        let user = args[0];
        if(!user) {
            msg.channel.send("Use `" + prefix + "help mute` to learn how to use this command");
            return;
        }
        let userId = user.replace(/\D/g, "");
        let muted = msg.guild.members.cache.find(v => v.user.id == userId);
        let guild = await DB.Guilds.collection("Info").findOne({ id: msg.guild.id });
        let mutedRole = guild.moderation.muteRole;
    
        muted.roles.remove(mutedRole);
    
        DB.Guilds.collection("Info").updateOne({ "id": guild.id, "members.id": muted.id }, { "$set": { "members.$.muted": false }}, (err, results) => {});
    
        msg.channel.send(`${user} has been unmuted early`);
    }
};