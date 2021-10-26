import translatte from "translatte";

function translate(msg, args) {
    let argsL = args.length,
        text,
        to,
        from;

    if(!argsL) {
        msg.channel.send("Use `=help translate` to learn how to use this command");
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

export default translate;