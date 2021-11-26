import { MessageEmbed } from "discord.js";
import { createWorker } from 'tesseract.js';
import fs from 'fs';
import fetch from 'node-fetch';
import { SlashCommandBuilder } from "@discordjs/builders";

var worker = false;
const resolved = new Promise(async (resolve, reject) => {
    let w = createWorker();
    await w.load();
    await w.loadLanguage('eng');
    await w.initialize('eng');

    worker = w;
    resolve(true);
});

export default {
    data: new SlashCommandBuilder()
        .setName("gettext")
        .setDescription("Use the text variation instead. Discord doesn't support attachments in slash commands"),
    description: `gettext\` makes me list the text from any PNG or JPEG files attached`,
    category: "misc",
    DMs: true,
    execute: async function(interaction) {
        let prefix = msg.guild ? (await DB.Guilds.collection("Info").findOne({ "id": interaction.guild.id })).prefix : "{prefix}";

        interaction.reply({ content: `Use \`${prefix}gettext\` instead. Discord slash commands don't support attachments yet`, ephemeral: true });
    },
    executeText: async function(msg, args) {
        msg.attachments.forEach(async e => {
            if(e.contentType === 'image/png' || e.contentType === 'image/jpeg' || e.contentType === 'image/bmp' || e.contentType === 'image/pbm') {
                let waiting = await msg.channel.send("Reading your image. Please be patient");
                let base64 = await fetch(e.proxyURL).then(r => r.buffer()).then(buf => `data:image/png;base64,` + buf.toString('base64'));
                if(!worker) await resolved;
                let data = await worker.recognize(base64);
    
                waiting.delete();
    
                if(data.data.text.length > 2000) {
                    let fileName = new Date() + ".txt";
                    let file = await new Promise((res, rej) => fs.writeFile(fileName, data.data.text, res));
    
                    msg.channel.send({ "files": [fileName] });
    
                    fs.rm(fileName, () => {});
                } else {
                    let embed = new MessageEmbed()
                        .setColor("#FAC000")
                        .setTitle(e.name)
                        .setDescription(data.data.text)
                        .setThumbnail(e.proxyUrl);
            
                    msg.channel.send({ "embeds": [embed] });
                }
            } else {
                msg.channel.send(e.contentType + " is not supported");
            }
        });
    }
};