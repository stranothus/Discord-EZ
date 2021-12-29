import isAdmin from "../../utils/isAdmin.mjs";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("infractions")
        .setDescription("Get infractions for a member")
        .addUserOption(option => option
            .setName("user")
            .setDescription("the user to check infractions for")
            .setRequired(true)
        ),
    description: `infractions [user]\` makes me list stored warnings/infractions of [user]`,
    category: "moderation",
    DMs: false,
    execute: async function(interaction) {
        let user = interaction.options.getUser("user");

        if(!isAdmin(interaction)) return;

        const members = await DB.Guilds.collection("Info").findOne({ "id": interaction.guild.id});
        const member = members.filter(v => v.id === user.id)[0];
        const infractions = member.infractions;

        if(infractions) {
            interaction.reply("**Infractions for <@!" + user.id + ">**\n\n`" + infractions.join("`\n`") + "`");
        } else {
            interaction.reply("No infractions for <@!" + user.id + ">");
        }
    },
    executeText: async function(msg, args) {
        let prefix = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix;
    
        if(!isAdmin(msg)) return;
    
        if(!args[0]) {
            msg.channel.send("Use `" + prefix + "help warn` to learn how to use this command");
            return;
        }
    
        let user = msg.guild.members.resolve(args[0].replace(/\D/g, ""));
    
        if(!user) {
            msg.channel.send("User not found");
            return;
        }
    
        const members = await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id});
        const member = members.filter(v => v.id === user.id)[0];
        const infractions = member.infractions;

        if(infractions) {
            msg.channel.send("**Infractions for <@!" + user.id + ">**\n\n`" + infractions.join("`\n`") + "`");
        } else {
            msg.channel.send("No infractions for <@!" + user.id + ">");
        }
    }
};