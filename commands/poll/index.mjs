import pollCollect from "./collect.mjs";

async function poll(msg, args) {
    let prefix = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix;

    let format = args.length % 2 ? args[args.length - 1] : false;

    if(args.length < 2) {
        msg.channel.send("Use `" + prefix + "help poll` to learn how to use this command");
        return;
    }
    
    if(format) {
        args.pop();
    }

    let msgs = args
        .map((v, i, a) => ((i % 2) ? undefined : {
            content: format ? format.replace(/{option}/g, v).replace(/{emoji}/g, a[i]) : `${v} ${a[i + 1]}`,
            emoji: a[i + 1],
            option: v
        }))
        .filter(v => v);

    let content = msgs.map(v => v.content);
    let emojis = msgs.map(v => v.emoji);
    let options = msgs.map(v => v.role);

    msg = await msg.channel.send(content.join("\n"));

    DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id }, { "$push": { "polls": {
        messageID: msg.id,
        channelID: msg.channel.id,
        reactions: {}
    }}}, function(err, result) {
        if(err) console.error(err);
    });
    
    emojis.forEach(v => (msg ? msg.react(v).catch(err => {
        let channel = msg.channel;
        msg.delete();

        channel.send("Something went wrong. Please make sure you are using valid emojis");
    }) : ""));

    pollCollect(msg, {});
}

export default poll;