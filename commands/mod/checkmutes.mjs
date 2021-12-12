import isAdmin from "../../utils/isAdmin.mjs";
import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("checkmutes")
        .setDescription("See muted members"),
    description: `checkmutes\` makes me list all current muted members`,
    category: "moderation",
    DMs: false,
    execute: async function(interaction) {
        if(!isAdmin(interaction)) return;

        let guildDB = await DB.Guilds.collection("Info").findOne({ "id": interaction.guild.id });
        let mutedRole = guildDB.moderation.muteRole;
        let officialMutes = guildDB.members.filter(v => v.muted);
        let unofficialMutes = (await msg.guild.roles.fetch(mutedRole)).members.filter(v => !(officialMutes.map(v => v.id).indexOf(v.user.id) + 1));

        let reply = new MessageEmbed()
            .setTitle("**Muted members**")
            .setDescription(officialMutes.map(v => `<@!${v.id}> is muted for ${(() => {
                let time = v.muted - Date.now();

                if(time >= 1000 * 60 * 60) time = Math.floor(time / (1000 * 60 * 60)) + " hours"
                if(time >= 1000 * 60) time = Math.floor(time / (1000 * 60)) + " minutes"
                if(time >= 1000) time = Math.floor(time / 1000) + " seconds"

                return time
            })()} for ${(v.infractions.reverse().filter(v => v.includes("Muted for"))[0] || "\"No reason\"").replace(/^Muted for/i, "")}`).join("\n") + "\n" + unofficialMutes.map(v => `<@!${v.user.id}> was muted by someone else`).join("\n"));
    
        interaction.reply({ embeds: [ reply ]});
    },
    executeText: async function(msg, args) {
        if(!isAdmin(msg)) return;

        let guildDB = await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id });
        let mutedRole = guildDB.moderation.muteRole;
        let officialMutes = guildDB.members.filter(v => v.muted);
        let unofficialMutes = (await msg.guild.roles.fetch(mutedRole)).members.filter(v => !(officialMutes.map(v => v.id).indexOf(v.user.id) + 1));
        
        let reply = new MessageEmbed()
            .setTitle("**Muted members**")
            .setDescription(officialMutes.map(v => `<@!${v.id}> is muted for ${(() => {
                let time = v.muted - Date.now();

                if(time >= 1000 * 60 * 60) time = Math.floor(time / (1000 * 60 * 60)) + " hours"
                if(time >= 1000 * 60) time = Math.floor(time / (1000 * 60)) + " minutes"
                if(time >= 1000) time = Math.floor(time / 1000) + " seconds"

                return time
            })()} for ${(v.infractions.reverse().filter(v => v.includes("Muted for"))[0] || "\"No reason\"").replace(/^Muted for/i, "")}`).join("\n") + "\n" + unofficialMutes.map(v => `<@!${v.user.id}> was muted by someone else`).join("\n"));
    
        msg.channel.send({ embeds: [ reply ]});
    }
};