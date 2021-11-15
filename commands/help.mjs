import { MessageEmbed } from "discord.js";

async function help(msg, args) {
    let prefix = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix;
    let message = "";
    if(args.length) {
        switch(args[0]) {
            case "commands":
                message = `You can use my commands to do powerful things. Read up about each one below!\n
                    \`${prefix}help ping\`
                    \`${prefix}help kauser\`
                    \`${prefix}help kaprogram\`
                    \`${prefix}help define\`
                    \`${prefix}help pronounce\`
                    \`${prefix}help translate\`
                    \`${prefix}help reactrole\`
                    \`${prefix}help reactroleone\`
                    \`${prefix}help poll\`
                    \`${prefix}help diebot\`
                    \`${prefix}help clear\`
                    \`${prefix}help clearall\`
                    \`${prefix}help mute\`
                    \`${prefix}help unmute\`
                    \`${prefix}help addword\`
                    \`${prefix}help removeword\`
                    \`${prefix}help prefix\`
                    \`${prefix}help warn\`
                    \`${prefix}help infractions\`
                    \`${prefix}help gettext\`
                    \`${prefix}help funnytext\``;
            break;
            case "syntax":
                message = `Using my commands is easy, really! I can't speak very good Enlgish though, so you'll need to help me by using the right command formatting, sometimes called syntax.
                    [user] - Ping a user or use their ID.
                    [role] - Ping a role or use its ID. If it says [role name], you can use the name of the role instead.
                    [number] - You need to use a number.
                    [emoji] - You need to use an emoji.
                    [time] - You need to use a number followed by a time unit like seconds or minutes.
                    other - Arguments are separated by spaces. If you need an argument with spaces, surround it in quotations marks like "argument with spaces".`;
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
                message = `\`${prefix}gettext\` makes me list the text from any PNG files attached`;
            break;
            case "funnytext":
                // tell how =gettext works
                message = `\`${prefix}funnytext [filters]...\* [message]\` makes me post a message from you made a little more fun. Use \`uwu\`, \`owo\`, \`blarb\`, \`piglatin\`, or \`reverse\` or you can use multiple! Find out what each one does and use several for your own combination`;
            break;
            case "invite":
                message = `\`${prefix}invite\` makes me give you my invite so you can add me to other servers`
            break;
        }
    } else {
        message = `Hey there, Discord user! I'm Discord-EZ, a general purpose bot to help with moderation, basic tasks, and fun! Use a command below to learn more about me!
            \`${prefix}help commands\`
            \`${prefix}help syntax\``;
    }

    var embed = new MessageEmbed()
        .setColor("#C0FA00")
        .setTitle("**" + (args[0] || "My commands") + "**")
        .setDescription(message);

    msg.channel.send({ "embeds": [embed] });
}

export default help;