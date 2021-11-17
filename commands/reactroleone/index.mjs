import isAdmin from "../../utils/isAdmin.mjs";
import reactRoleOne    from "./collect.mjs";

async function reactroleone(msg, args) {
    let prefix = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix;

    if(!isAdmin(msg)) return;

    if(args.length < 2) {
        msg.channel.send("Use `" + prefix + "help reactroleone` to learn how to use this command");
        return;
    }

    let format = args.length % 2 ? args[args.length - 1] : false;

    if(format) {
        args.pop();
    }

    let msgs = args
        .map((v, i, a) => ((i % 2) ? undefined : {
            content: format ? format.replace(/{role}/g, "<@&" + v + ">").replace(/{emoji}/g, a[i + 1]) : `To get <@&${v}>, react with ${a[i + 1]}`,
            emoji: a[i + 1],
            role: v,
            id: undefined
        }))
        .filter(v => v);

    let content = msgs.map(v => v.content);
    let emojis = msgs.map(v => v.emoji);
    let roles = msgs.map(v => v.role);
    let ids = msgs.map(v => v.id);
    
    let stuff = await Promise.all(roles.map(async (v, i) => {
        let role = msg.guild.roles.cache.find(x => x.name === v) || await msg.guild.roles.create({ name: v });

        content[i] = format ? format.replace(/{role}/g, `<@&${role.id}>`).replace(/{emoji}/g, emojis[i]) : `To get <@&${role.id}>, ` + `react with ${emojis[i]}`;
        ids[i] = role.id;
        msgs[i].id = role.id

        return role;
    }));

    msg = await msg.channel.send(content.join("\n"));

    DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id }, { "$push": { "reactroleones": {
        messageID: msg.id,
        channelID: msg.channel.id,
        reacttorole: msgs.map(v => ({
            id: v.id,
            emoji: v.emoji
        })),
        reactions: {},
        records: {}
    }}}, function(err, result) {
        if(err) console.error(err);
    });
    
    emojis.forEach(v => (msg ? msg.react(v).catch(err => {
        let channel = msg.channel;
        msg.delete();

        channel.send("Something went wrong. Please make sure you are using valid emojis");
    }) : ""));

    let reactions = msgs.map(v => v.emoji);

    reactRoleOne(msg, ids, emojis, {});
}

export default reactroleone;