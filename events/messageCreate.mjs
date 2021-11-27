// import utils
import deQuote from "../utils/deQuote.mjs";
import dirFlat from "../utils/dirFlat.mjs";
import modwords from "../utils/modwords.mjs";

const commands = Promise.all(dirFlat("./commands").map(async v => {
    let imported = await import("../" + v);

    return {
        command: v.replace(/\.[^\.]+$/, ""),
        file: v,
        ...imported.default
    };
}));

async function messageCreate(msg) {
    if(!msg.guild) {
        if(msg.author.bot) return;
        var args = msg.content.split(/("[^"]*")|\s+/).filter(v => v).map(v => deQuote(v));
        var command = args[0].toLowerCase();
        args.splice(0, 1);

        let index = (await commands).findIndex(v => v.data.name === command);
            index = (await commands)[index];

        if(!index) {
            msg.channel.send("You can check my commands with \`help\`");
            return;
        }

        if(index.DMs) {
            index.executeText(msg, args);
        } else {
            msg.channel.send("You can only use this command in servers");
        }
    } else if((msg.content.startsWith((await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix) || msg.content.match(new RegExp("^<@!?" + client.user + ">\\s*"))) && !msg.author.bot) {
        var command = msg.content.replace(new RegExp("^(" + (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix.replace(/(\\|\/|\.|\^|\$|\(|\)|\[|\]|\?)/, "\\$1") + "\\s*)|(<@!?" + client.user + ">\\s*)", ""), "").split(" ")[0].toLowerCase();
        var args = msg.content.replace(new RegExp(`[\\s\\S]*?${command}\\s*`), "").split(/("[^"]*")|\s+/).filter(v => v).map(v => deQuote(v));

        let index = (await commands).findIndex(v => v.data.name === command);
            index = (await commands)[index];

        if(!index) {
            msg.channel.send("You can check my commands with \`help\`");
            return;
        }

        index.executeText(msg, args);
    } else {
        modwords(msg);
    }
}

export default messageCreate;