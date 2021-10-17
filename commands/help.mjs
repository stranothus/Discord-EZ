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
                message = `\`=reactrole [role name] [emoji]...\` makes me a reaction role. Users can react with \`[emoji]\` on the message to make me give them \`[role name]\`. Don't worry if the role doesn't exist, I'll make it for you! Multiple reaction roles can be included in one message by repeating the format. Roles must be contained in quotation marks if spaces are present`
            break;
            case "":
                message = `\`=diebot\` makes me delete my messages`;
            break;
            case "":
                message = `\`=clear [number]*\` makes me delete \`[number]\` messages. If number is not specified, I will delete 99 messages. Older messages might not be deleteable`;
            break;
            case "":
                message = `\`=clearall\` makes me delete *every single message in the channel*. Use this command with caution!`;
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
            \`diebot\`
            \`clear\`
            \`clearall\``;
    }

    var embed = new MessageEmbed()
        .setColor("#C0FA00")
        .setTitle("**" + (args[0] || "My commands") + "**")
        .setDescription(message);

    msg.channel.send({ "embeds": [embed] });
}

export default help;