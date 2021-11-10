import uwu from "./uwu.mjs";
import blarb from "./blarb.mjs";
import reverse from "./reverse.mjs";
import asUser from "../../utils/asUser.mjs";

async function funnytext(msg, args) {
    let funnytexts = {
        "uwu": uwu,
        "owo": uwu,
        "blarb": blarb,
        "reverse": reverse
    };
    
    let commands = [];

    if(!funnytexts[args[0]]) {
        let keys = Object.keys(funnytexts);

        commands.push(funnytexts[keys[Math.floor(Math.random() * keys.length)]]);
    }
    while(funnytexts[args[0]]) {
        commands.push(funnytexts[args[0]]);
        args.shift();
    }

    let text = args.join(" ");
    for(let i = 0; i < commands.length; i++) {
        text = await commands[i](text, msg.guild);
    }

    asUser(msg.channel, msg.author, text);
    msg.delete();
}

export default funnytext;