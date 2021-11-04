// import commands
import clear from "../commands/clear/clear.mjs";
import clearall from "../commands/clear/clearall.mjs";
import define from "../commands/lignuistic/define.mjs";
import diebot from "../commands/clear/diebot.mjs";
import help from "../commands/help.mjs";
import kaprogram from "../commands/ka/kaprogram.mjs";
import kauser from "../commands/ka/kauser.mjs";
import ping from "../commands/ping.mjs";
import pronounce from "../commands/lignuistic/pronounce.mjs";
import reactrole from "../commands/reactrole/index.mjs";
import translate from "../commands/lignuistic/translate.mjs";
import poll from "../commands/poll/index.mjs";
import mute from "../commands/mute/mute.mjs";
import earlyunmute from "../commands/mod/unmute.mjs";
import modwords from "../commands/pottymouth/modwords.mjs";
import addword from "../commands/pottymouth/addword.mjs";
import removeword from "../commands/pottymouth/removeword.mjs";
import prefix from "../commands/prefix.mjs";
import warn from "../commands/mod/warn.mjs";
import infractions from "../commands/mod/infraction.mjs";
import status from "../commands/status.mjs";
import gettext from "../commands/gettext.mjs";
import reactroleone from "../commands/reactroleone/index.mjs";

// import utils
import deQuote from "../utils/deQuote.mjs";

async function messageCreate(msg) {
    if(msg.content.startsWith((await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix) || msg.content.startsWith("<@!886933964537880617> ")) {
        var command = msg.content.replace(new RegExp("^(" + (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix.replace(/(\\|\/|\.|\^|\$|\(|\)|\[|\])/, "\\$1") + ")|(<@!886933964537880617> )", ""), "").split(" ")[0];
        var args = msg.content.split(/("[^"]*")|\s+/).slice(1).filter(v => v).map(v => deQuote(v));

        switch(command.toLowerCase()) {
            case "ping":
                ping(msg, args);
            break;
            case "kauser":
                kauser(msg, args);
            break;
            case "kaprogram":
                kaprogram(msg, args);
            break;
            case "define":
                define(msg, args);
            break;
            case "pronounce":
                pronounce(msg, args);
            break;
            case "translate":
                translate(msg, args);
            break;
            case "reactrole":
                reactrole(msg, args);
            break;
            case "reactroleone":
                reactroleone(msg, args);
            break;
            case "poll":
                poll(msg, args);
            break;
            case "diebot":
                diebot(msg, args);
            break;
            case "clear":
                clear(msg, args);
            break;
            case "clearall":
                clearall(msg, args);
            break;
            case "mute":
                mute(msg, args);
            break;
            case "unmute":
                earlyunmute(msg, args);
            break;
            case "addword":
                addword(msg, args);
            break;
            case "removeword":
                removeword(msg, args);
            break;
            case "prefix":
                prefix(msg, args);
            break;
            case "warn":
                warn(msg, args);
            break;
            case "infractions":
                infractions(msg, args);
            break;
            case "status":
                status(msg, args);
            break;
            case "gettext":
                gettext(msg, args);
            break;
            case "help":
                help(msg, args);
            break;
            default:
                msg.channel.send("You can check my commands using =help");
        }
    } else {
        modwords(msg);
    }
}

export default messageCreate;