import { MessageEmbed } from "discord.js";

function help(msg, args) {
    let message = "";
    if(args.length) {
        switch(args[0]) {
            case "ping":
                // tell how =ping works
                message = `\`=ping\` makes me respond with \`Pong!\``;
            break;
            case "kauser":
                // tell how =kauser works
                message = `\`=kauser [username or kaid]\` makes me respond with the corresponding Khan Academy user information`;
            break;
            case "kaprogram":
                // tell how =kaprogram works
                message = `\`=kauser [program ID]\` makes me respond with the corresponding Khan Academy program information`;
            break;
            case "define":
                // tell how =define works
                message = `\`=define [word]\` makes me give a definition or set of definitions for a word`;
            break;
            case "pronounce":
                // tell how =pronounce works
                message = `\`=pronounce [word]\` makes me link a YoutTube video of how to pronounce your word`;
            break;
            case "translate":
                // tell how =translate works
                message = `\`=translate [langauge]* [word(s)]\` makes me translate your word(s) into English. You can optionally specify a language. Make sure to wrap phrases in quotation marks or I'll only translate the first word`
            break;
            case "reactrole":
                // tell how =reactrole works
                message = `\`=reactrole [role name] [emoji]...\` makes me make a reaction role. Users can react with \`[emoji]\` on the message to make me give them \`[role name]\`. Don't worry if the role doesn't exist, I'll make it for you! Multiple reaction roles can be included in one message by repeating the format. Roles must be contained in quotation marks if spaces are present`
            break;
            case "poll":
                // tell how =poll works
                message = `\`=poll [option] [emoji]...\` makes me hold a poll. Users can react with \`[emoji]\` on the message to make me give them \`[role name]\`, but they can only react once, so voting is fair. Options must be contained in quotation marks if spaces are present`
            break;
            case "diebot":
                // tell how =diebot works
                message = `\`=diebot\` makes me delete my messages`;
            break;
            case "clear":
                // tell how =clear works
                message = `\`=clear [number]\\*\` makes me delete \`[number]\` messages. If number is not specified, I will delete 99 messages. Older messages might not be deleteable`;
            break;
            case "clearall":
                // tell how =clearall works
                message = `\`=clearall\` makes me delete *every single message in the channel*. Use this command with caution!`;
            break;
            case "mute":
                // tell how =mute works
                message = `\`=mute [user] [time]\\* [reason]\\*\` makes me mute a user for \`[time]\` of format \`[number][unit of time]\` or a default of one week`;
            break;
            case "unmute":
                // tell how =unmute works
                message = `\`=unmute [user]\` make me unmute a muted user early`;
            break;
            case "addword":
                // tell how =unmute works
                message = `\`=addword [word]\` make me add a word to a list of censored words`;
            break;
            case "removeword":
                // tell how =unmute works
                message = `\`=removeword [word]\` make me remove a word from a list of censored words`;
            break;
            case "prefix":
                // tell how =prefix works
                message = `\`=prefix [new prefix]*\` I'll state my prefix or set it to a new one!`;
            break;
            case "warn":
                // tell how =warn works
                message = `\`=warn [user] [reason]\` makes me store a warning for [user] about [reason] to review for various purposes`;
            break;
            case "infractions":
                // tell how =infractions works
                message = `\`=infractions [user]\` makes me list stored warnings/infractions of [user]`;
            break;
        }
    } else {
        // send list of all commands with basic description
        message = `
            Ask for help with any of my commands!\n
            \`ping\`\n
            \`kauser\`\n
            \`kaprogram\`\n
            \`define\`\n
            \`pronounce\`\n
            \`translate\`\n
            \`reactrole\`\n
            \`poll\`\n
            \`diebot\`\n
            \`clear\`\n
            \`clearall\`\n
            \`mute\`\n
            \`unmute\`\n
            \`addword\`\n
            \`removeword\``;
    }

    var embed = new MessageEmbed()
        .setColor("#C0FA00")
        .setTitle("**" + (args[0] || "My commands") + "**")
        .setDescription(message);

    msg.channel.send({ "embeds": [embed] });
}

export default help;