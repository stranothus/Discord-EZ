import isAdmin from "../../utils/isAdmin.mjs";
import reactRoleOne    from "./collect.mjs";

async function reactroleone(msg, args) {
    let prefix = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix;

    if(!isAdmin(msg)) return;

    if(args.length % 2) {
        msg.channel.send("Use `" + prefix + "help reactrole` to learn how to use this command");
        return;
    }

    let msgs = args
        .map((v, i, a) => ((i % 2) ? undefined : {
            content: `To get @${v}, react with ${a[i + 1]}`,
            emoji: a[i + 1],
            role: v
        }))
        .filter(v => v);

    let content = msgs.map(v => v.content);
    let emojis = msgs.map(v => v.emoji);
    let roles = msgs.map(v => v.role);
    
    let stuff = await Promise.all(roles.map(async (v, i) => {
        let role = msg.guild.roles.cache.find(x => x.name === v) || await msg.guild.roles.create({ name: v });

        content[i] = `To get <@&${role.id}>, ` + `react with ${emojis[i]}`;
        roles[i] = role;

        return role;
    }));

    msg = await msg.channel.send(content.join("\n"));

    DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id }, { "$push": { "reactroleones": {
        messageID: msg.id,
        channelID: msg.channel.id,
        reacttorole: msgs.map(v => ({
            role: v.role,
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

    roles = msgs.map(v => v.role);
    let reactions = msgs.map(v => v.emoji);

    reactRoleOne(msg, roles, emojis, {});
}

export default reactroleone;