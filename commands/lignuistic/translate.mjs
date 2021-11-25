import translatte from "translatte";


export default {
    data: new SlashCommandBuilder()
        .setName("translate")
        .setDescription("translate text from one language to another")
        .addStringOption(option => option
            .setName("text")
            .setDescription("the text to translate")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("to")
            .setDescription("the language to translate to")
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName("from")
            .setDescription("the language to translate from")
            .setRequired(false)
        ),
    description: `translate [word(s)] [to]\* [from]\*\` makes me translate your word(s) into English. You can optionally specify a language.`,
    category: "linguistics",
    DMs: true,
    execute: async function(interaction) {
        let text = interaction.options.getString("text");
        let to = interaction.options.getString("to") || "en";
        let from = interaction.options.getString("from");
    
        translatte(text, from ? { to: to, from: from } : { to: to }).then(res => {
            interaction.reply(res.text + (from ? "" : ` (translated from ${res.from.language.iso})`));
        }).catch(err => {
            interaction.reply({ content: "Something went wrong with your translation", ephemeral: true });
        });
    },
    executeText: async function(msg, args) {
        let prefix = msg.guild ? (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix : "{prefix}";
    
        let argsL = args.length,
            text,
            to,
            from;
    
        if(!argsL) {
            msg.channel.send("Use `" + prefix + "help translate` to learn how to use this command");
            return;
        }
    
        text = args[0];
        to = args[1] || "en";
        from = args[2];
    
        translatte(text, from ? { to: to, from: from } : { to: to }).then(res => {
            msg.channel.send(res.text + (from ? "" : ` (translated from ${res.from.language.iso})`));
        }).catch(err => {
            console.error(err);
        });
    }
};