import { MessageEmbed } from "discord.js";

async function help(msg, args) {
    let prefix = msg.guild ? (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix : "{prefix}";
    let message = "";
    if(args.length) {
        switch(args[0]) {
            case "misc":
                var embed = new MessageEmbed()
                    .setColor("#C0FA00")
                    .setTitle("**Miscellaneous commands**")
                    .setDescription("Here are some of my miscellaneous commands for various tasks or fun")
                    .setThumbnail(client.user.avatarURL(true))
                    .addFields(
                        {
                            name: "Ping",
                            value: `\`${prefix}help ping\``
                        },
                        {
                            name: "Hold a poll",
                            value: `\`${prefix}help poll\``
                        },
                        {
                            name: "Get text from image",
                            value: `\`${prefix}help gettext\``
                        },
                        {
                            name: "Get user avatar",
                            value: `\`${prefix}help avatar\``
                        }
                    );
                
                msg.channel.send({ "embeds": [embed] });
            break;
            case "ka":
                var embed = new MessageEmbed()
                    .setColor("#C0FA00")
                    .setTitle("**Khan Academy commands**")
                    .setDescription("Here are some of my commands for checking out Khan Academy information")
                    .setThumbnail(client.user.avatarURL(true))
                    .addFields(
                        {
                            name: "Khan Academy user",
                            value: `\`${prefix}help kauser\``
                        },
                        {
                            name: "Khan Academy program",
                            value: `\`${prefix}help kaprogram\``
                        }
                    );
                
                msg.channel.send({ "embeds": [embed] });
            break;
            case "linguistics":
                var embed = new MessageEmbed()
                    .setColor("#C0FA00")
                    .setTitle("**Linguistic commands**")
                    .setDescription("Here are some of my linguistic commands")
                    .setThumbnail(client.user.avatarURL(true))
                    .addFields(
                        {
                            name: "Define a word",
                            value: `\`${prefix}help define\``
                        },
                        {
                            name: "Pronounce a word",
                            value: `\`${prefix}help pronounce\``
                        },
                        {
                            name: "Translate from a language to another",
                            value: `\`${prefix}help translate\``
                        }
                    );
                
                msg.channel.send({ "embeds": [embed] });
            break;
            case "roles":
                var embed = new MessageEmbed()
                    .setColor("#C0FA00")
                    .setTitle("**Role commands**")
                    .setDescription("Here are my commands for setting user roles")
                    .setThumbnail(client.user.avatarURL(true))
                    .addFields(
                        {
                            name: "React role",
                            value: `\`${prefix}help reactrole\``
                        },
                        {
                            name: "React role limited",
                            value: `\`${prefix}help reactroleone\``
                        }
                    );
                
                msg.channel.send({ "embeds": [embed] });
            break;
            case "pruning":
                var embed = new MessageEmbed()
                    .setColor("#C0FA00")
                    .setTitle("**Pruning commands**")
                    .setDescription("Here are some of my commands for pruning messages")
                    .setThumbnail(client.user.avatarURL(true))
                    .addFields(
                        {
                            name: "Clear bot messages",
                            value: `\`${prefix}help diebot\``
                        },
                        {
                            name: "Clear chat messages",
                            value: `\`${prefix}help clear\``
                        },
                        {
                            name: "Clear channel",
                            value: `\`${prefix}help clear\``
                        }
                    );
                
                msg.channel.send({ "embeds": [embed] });
            break;
            case "moderation":
                var embed = new MessageEmbed()
                    .setColor("#C0FA00")
                    .setTitle("**Moderation commands**")
                    .setDescription("Here are some of my commands for moderating your server")
                    .setThumbnail(client.user.avatarURL(true))
                    .addFields(
                        {
                            name: "Mute a user",
                            value: `\`${prefix}help mute\``
                        },
                        {
                            name: "Unmute a user",
                            value: `\`${prefix}help unmute\``
                        },
                        {
                            name: "Add a word to censor",
                            value: `\`${prefix}help addword\``
                        },
                        {
                            name: "Remove a word to censor",
                            value: `\`${prefix}help removeword\``
                        },
                        {
                            name: "Check censored words",
                            value: `\`${prefix}help checkwords\``
                        },
                        {
                            name: "Warn a user",
                            value: `\`${prefix}help warn\``
                        },
                        {
                            name: "View user warnings",
                            value: `\`${prefix}help infractions\``
                        }
                    );
                
                msg.channel.send({ "embeds": [embed] });
            break;
            case "webhooks":
                var embed = new MessageEmbed()
                    .setColor("#C0FA00")
                    .setTitle("**Webhook commands**")
                    .setDescription("Here are some of my commands for webhook fun")
                    .setThumbnail(client.user.avatarURL(true))
                    .addFields(
                        {
                            name: "Filter text",
                            value: `\`${prefix}help funnytext\``
                        },
                        {
                            name: "Binary text",
                            value: `\`${prefix}help binary\``
                        }
                    );
                
                msg.channel.send({ "embeds": [embed] });

            break;
            case "settings":
                var embed = new MessageEmbed()
                    .setColor("#C0FA00")
                    .setTitle("**Setting commands**")
                    .setDescription("Here are some of my commands for server bot settings")
                    .setThumbnail(client.user.avatarURL(true))
                    .addFields(
                        {
                            name: "Set or check prefix",
                            value: `\`${prefix}help prefix\``
                        }
                    );
                
                msg.channel.send({ "embeds": [embed] });

            break;
            case "about":
                var embed = new MessageEmbed()
                    .setColor("#C0FA00")
                    .setTitle("**About commands**")
                    .setDescription("Here are some of my commands for learning more about me <3")
                    .setThumbnail(client.user.avatarURL(true))
                    .addFields(
                        {
                            name: "My invite",
                            value: `\`${prefix}help invite\``
                        },
                        {
                            name: "My GitHub repo",
                            value: `\`${prefix}help github\``
                        }
                    );
                
                msg.channel.send({ "embeds": [embed] });

            break;
            case "syntax":
                var embed = new MessageEmbed()
                    .setColor("#C0FA00")
                    .setTitle("**Syntax**")
                    .setDescription("Using my commands is easy, really! I can't speak very good Enlgish though, so you'll need to help me by using the right command formatting, sometimes called syntax")
                    .setThumbnail(client.user.avatarURL(true))
                    .addFields(
                        {
                            name: "[user]",
                            value: `User ID or mention`
                        },
                        {
                            name: "[role]",
                            value: `Role mention`
                        },
                        {
                            name: "[number]",
                            value: `A number`
                        },
                        {
                            name: "[emoji]",
                            value: `An emoji`
                        },
                        {
                            name: "[time]",
                            value: `Unit of time`
                        },
                        {
                            name: "other",
                            value: `Text`
                        }
                    );
                
                msg.channel.send({ "embeds": [embed] });
            break;
            case "ping":
                // tell how =ping works
                message = `\`${prefix}ping\` makes me respond with \`Pong!\`.`;
            break;
            case "kauser":
                // tell how =kauser works
                message = `\`${prefix}kauser [username or kaid]\` makes me respond with the corresponding Khan Academy user information.`;
            break;
            case "kaprogram":
                // tell how =kaprogram works
                message = `\`${prefix}kaprogram [program ID]\` makes me respond with the corresponding Khan Academy program information.`;
            break;
            case "define":
                // tell how =define works
                message = `\`${prefix}define [word]\` makes me give a definition or set of definitions for a word.`;
            break;
            case "pronounce":
                // tell how =pronounce works
                message = `\`${prefix}pronounce [word]\` makes me link a YouTube video of how to pronounce your word.`;
            break;
            case "translate":
                // tell how =translate works
                message = `\`${prefix}translate [word(s)] [to]\* [from]\*\` makes me translate your word(s) into English. You can optionally specify a language. Make sure to wrap phrases in quotation marks or I'll only translate the first word.`
            break;
            case "reactrole":
                // tell how =reactrole works
                message = `\`${prefix}reactrole [role name] [emoji]...\` makes me make a reaction role. Users can react with \`[emoji]\` on the message to make me give them \`[role name]\`.
                Don't worry if the role doesn't exist, I'll make it for you! Multiple reaction roles can be included in one message by repeating the format. Roles must be contained in quotation marks if spaces are present.
                Optionally, add a final argument at the end. This should be a string of text to format each option off of. Use {role} and {emoji} in the text to be replaced with each role and emoji.`
            break;
            case "reactroleone":
                // tell how =reactrole works
                message = `\`${prefix}reactroleone [role name] [emoji]...\` makes me make a reaction role. Users can react with \`[emoji]\` on the message to make me give them \`[role name]\`.
                Don't worry if the role doesn't exist, I'll make it for you! Multiple reaction roles can be included in one message by repeating the format, but users can only react to have one of the roles. Roles must be contained in quotation marks if spaces are present.
                Optionally, add a final argument at the end. This should be a string of text to format each option off of. Use {role} and {emoji} in the text to be replaced with each role and emoji.`
            break;
            case "poll":
                // tell how =poll works
                message = `\`${prefix}poll [option] [emoji]...\` makes me hold a poll. Users can react with \`[emoji]\` on the message to make me give them \`[role name]\`, but they can only react once, so voting is fair. Options must be contained in quotation marks if spaces are present.
                Optionally, add a final argument at the end. This should be a string of text to format each option off of. Use {option} and {emoji} in the text to be replaced with each option and emoji.`
            break;
            case "diebot":
                // tell how =diebot works
                message = `\`${prefix}diebot\` makes me delete my messages`;
            break;
            case "clear":
                // tell how =clear works
                message = `\`${prefix}clear [number]\*\` makes me delete \`[number]\` messages. If number is not specified, I will delete 99 messages. Older messages might not be deleteable`;
            break;
            case "clearall":
                // tell how =clearall works
                message = `\`${prefix}clearall\` makes me delete *every single message in the channel*. Use this command with caution!`;
            break;
            case "mute":
                // tell how =mute works
                message = `\`${prefix}mute [user] [time]\* [reason]\*\` makes me mute a user for \`[time]\` of format \`[number][unit of time]\` or a default of one week`;
            break;
            case "unmute":
                // tell how =unmute works
                message = `\`${prefix}unmute [user]\` make me unmute a muted user early`;
            break;
            case "addword":
                // tell how =unmute works
                message = `\`${prefix}addword [word]\` make me add a word to a list of censored words`;
            break;
            case "removeword":
                // tell how =unmute works
                message = `\`${prefix}removeword [word]\` make me remove a word from a list of censored words`;
            break;
            case "checkwords":
                // tell how =unmute works
                message = `\`${prefix}checkwords\` I'll send a list of censored words. Make sure to use this in a staff only channel!`;
            break;
            case "prefix":
                // tell how =prefix works
                message = `\`${prefix}prefix [new prefix]\*\` I'll state my prefix or set it to a new one!`;
            break;
            case "warn":
                // tell how =warn works
                message = `\`${prefix}warn [user] [reason]\` makes me store a warning for [user] about [reason] to review for various purposes`;
            break;
            case "infractions":
                // tell how =infractions works
                message = `\`${prefix}infractions [user]\` makes me list stored warnings/infractions of [user]`;
            break;
            case "gettext":
                // tell how =gettext works
                message = `\`${prefix}gettext\` makes me list the text from any PNG or JPEG files attached`;
            break;
            case "funnytext":
                // tell how =gettext works
                message = `\`${prefix}funnytext [filters]...\* [message]\` makes me post a message from you made a little more fun. Use \`uwu\`, \`owo\`, \`blarb\`, \`piglatin\`, \`shakespeare\`, \`lego\`, or \`reverse\` or you can use multiple! Find out what each one does and use several for your own combination`;
            break;
            case "invite":
                message = `\`${prefix}invite\` makes me give you my invite so you can add me to other servers`
            break;
            case "github":
                message = `\`${prefix}invite\` makes me give you my GitHub repo link`
            break;
            case "avatar":
                message = `\`${prefix}avatar [user]\*\` I'll send a larger picture of your avatar or the user mentioned in the command`
            break;
            case "binary":
                message = `\`${prefix}binary [text]\*\` I'll convert to or from binary`
            break;
        }
    } else {
        var embed = new MessageEmbed()
            .setColor("#C0FA00")
            .setTitle("**My commands**")
            .setDescription("Hey there, Discord user! I'm Discord-EZ, a general purpose bot to help with moderation, basic tasks, and fun! Select help with one of my modules below")
            .setThumbnail(client.user.avatarURL(true))
            .addFields(
                {
                    name: "Syntax guide",
                    value: `\`${prefix}help syntax\``
                },
                {
                    name: "Moderation",
                    value: `\`${prefix}help moderation\``
                },
                {
                    name: "Webhooks",
                    value: `\`${prefix}help webhooks\``
                },
                {
                    name: "Linguistics",
                    value: `\`${prefix}help linguistics\``
                },
                {
                    name: "Khan Academy",
                    value: `\`${prefix}help ka\``
                },
                {
                    name: "Roles",
                    value: `\`${prefix}help roles\``
                },
                {
                    name: "Message pruning",
                    value: `\`${prefix}help pruning\``
                },
                {
                    name: "Server settings",
                    value: `\`${prefix}help settings\``
                },
                {
                    name: "Miscellaneous",
                    value: `\`${prefix}help misc\``
                },
                {
                    name: "About the bot",
                    value: `\`${prefix}help about\``
                }
            );
        
        msg.channel.send({ "embeds": [embed] });
    }
}

export default help;