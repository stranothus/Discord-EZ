import asUser from "../utils/asUser.mjs";
import uwu from "../utils/funnytext/uwu.mjs";
import blarb from "../utils/funnytext/blarb.mjs";
import reverse from "../utils/funnytext/reverse.mjs";
import piglatin from "../utils/funnytext/piglatin.mjs";
import shakespeare from "../utils/funnytext/shakespeare.mjs";
import lego from "../utils/funnytext/lego.mjs";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("funnytext")
        .setDescription("Send a message put through one or more filters as you")
        .addStringOption(option => option
            .setName("filters")
            .setDescription("uwu, owo, blarb, piglatin, shakespeare, lego, or reverse")
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName("text")
            .setDescription("the text to filter and send")
        ),
    description: `funnytext [filters]...\* [message]\` makes me post a message from you made a little more fun. Use \`uwu\`, \`owo\`, \`blarb\`, \`piglatin\`, \`shakespeare\`, \`lego\`, or \`reverse\` or you can use multiple! Find out what each one does and use several for your own combination`,
    category: "webhooks",
    DMs: false,
    execute: async function(interaction) {
        let funnytexts = {
            "uwu": uwu,
            "owo": uwu,
            "blarb": blarb,
            "reverse": reverse,
            "piglatin": piglatin,
            "shakespeare": shakespeare,
            "lego": lego
        };
        
        let filters = interaction.options.getString("filters");
        let commands = [];
    
        if(!filters) {
            let keys = Object.keys(funnytexts);
    
            commands.push(funnytexts[keys[Math.floor(Math.random() * keys.length)]]);
        } else {
            filters = filters.split(/(?:,\s*)|(\s+)/);

            for(let i = 0; i < filters.length; i++) {
                commands.push(funnytexts[filters[i].toLowerCase()] || funnytexts[keys[Math.floor(Math.random() * keys.length)]]);
            }
        }
    
        let text = interaction.options.getString("text");
        for(let i = 0; i < commands.length; i++) {
            text = await commands[i](text, msg.guild);
        }
    
        asUser(interaction.channel, interaction.author, text);

        interaction.reply({ content: "Message sent", ephemeral: true});
    },
    executeText: async function(msg, args) {
        let funnytexts = {
            "uwu": uwu,
            "owo": uwu,
            "blarb": blarb,
            "reverse": reverse,
            "piglatin": piglatin,
            "shakespeare": shakespeare,
            "lego": lego
        };
        
        let commands = [];
    
        if(!funnytexts[args[0]]) {
            let keys = Object.keys(funnytexts);
    
            commands.push(funnytexts[keys[Math.floor(Math.random() * keys.length)]]);
        }
        while(funnytexts[args[0]]) {
            commands.push(funnytexts[args[0].toLowerCase()]);
            args.shift();
        }
    
        let text = args.join(" ");
        for(let i = 0; i < commands.length; i++) {
            text = await commands[i](text, msg.guild);
        }
    
        asUser(msg.channel, msg.author, text);
        msg.delete();
    }
};