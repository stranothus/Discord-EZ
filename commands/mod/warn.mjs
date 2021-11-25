import isAdmin from "../../utils/isAdmin.mjs";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Add an infraction to a user's server record")
        .addUserOption(option => option
            .setName("user")
            .setDescription("the user to warn")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("reason")
            .setDescription("the reason for warning the user")
            .setRequired(true)
        ),
    description: `warn [user] [reason]\` makes me store a warning for [user] about [reason] to review for various purposes`,
    category: "moderation",
    DMs: false,
    execute: async function(interaction) {
        if(!isAdmin(msg)) return;
    
        let user = interaction.options.getUser("user");
    
        interaction.reply("Infraction recorded");
    
        DB.Guilds.collection("Info").updateOne({ "id": interaction.guild.id, "members.id": user.id }, { "$push": { "members.$.infractions": interaction.options.getString("reason") }}, () => {});
    },
    executeText: async function(msg, args) {
        let prefix = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix;
    
        if(!isAdmin(msg)) return;
        
        if(!args[0] || !args[1]) {
            msg.channel.send("Use `" + prefix + "help warn` to learn how to use this command");
            return;
        }
    
        let user = msg.guild.members.resolve(args[0].replace(/\D/g, ""));
    
        if(!user) {
            msg.channel.send("User not found");
            return;
        }
    
        msg.channel.send("Infraction recorded");
    
        DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id, "members.id": user.user.id }, { "$push": { "members.$.infractions": args[1] }}, () => {});
    }
};