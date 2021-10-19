import translatte from "translatte";

function translate(msg, args) {
    let argsL = args.length,
        text,
        from;

    if(!argsL) {
        msg.channel.send("Use `=help translate` to learn how to use this command");
        return;
    }

    if(argsL - 1) {
        from = args[0];
        text = args[1];
    } else {
        from = "";
        text = args[0];
    }

    translatte(text, { to: 'en' }).then(res => {
        msg.channel.send(res.text + (from ? "" : ` (translated from ${res.from.language.iso})`));
    }).catch(err => {
        console.error(err);
    });
}

export default translate;