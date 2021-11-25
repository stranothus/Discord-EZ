import censor from "../../utils/censor.mjs";
import asUser from "../../utils/asUser.mjs";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("binary")
        .setDescription("Send a message decoded from or encoded to binary from you")
        .addStringOption(option => option
            .setName("text")
            .setDescription("text to convert")
            .setRequired(true)
        ),
    description: `binary [text]\*\` I'll convert to or from binary`,
    category: "webhooks",
    DMs: false,
    execute: async function(interaction) {
        let text = interaction.options.getString("text");
    
        if(text.replace(/0|1|\s/g, "")) {
            text = text.split("").map(v => "0" + v.charCodeAt(0).toString(2)).join(" ");
        } else {
            text = await censor(text.split(" ").map(v => String.fromCharCode(parseInt(v, 2))).join(""), msg.guild);
        }
    
        asUser(interaction.channel, interaction.author, text);
        
        interaction.reply({ content: "Message sent", ephemeral: true });
    },
    executeText: async function(msg, args) {
        let text = args.join(" ");
    
        if(text.replace(/0|1|\s/g, "")) {
            text = text.split("").map(v => "0" + v.charCodeAt(0).toString(2)).join(" ");
        } else {
            text = await censor(text.split(" ").map(v => String.fromCharCode(parseInt(v, 2))).join(""), msg.guild);
        }
    
        asUser(msg.channel, msg.author, text);
        msg.delete();
    },
};