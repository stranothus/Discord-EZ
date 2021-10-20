import unmute from "./unmute.mjs";

async function mute(msg, args) {
    let user = args[0];
    if(!user) {
        msg.channel.send("Use `=help mute` to learn how to use this command");
        return;
    }
    let userId = user.replace(/\D/g, "");
    let time = args[1] || "1week";
    let reason = args[2] || "Because I can";

    let muted = msg.guild.members.cache.find(v => v.user.id == userId);
    let guild = await DB.Guilds.collection("Info").findOne({ id: msg.guild.id });
    let mutedRole = guild.moderation.muteRole;
    muted.roles.add(mutedRole);

    msg.channel.send(`${user} has been muted for ${time} (${reason})`);

    let timeUnit = {
        "s": 1,
        "sec": 1,
        "secs": 1,
        "second": 1,
        "seconds": 1,
        "m": 60,
        "min": 60,
        "mins": 60,
        "minute": 60,
        "minutes": 60,
        "h": 60 * 60,
        "hour": 60 * 60,
        "hours": 60 * 60,
        "d": 60 * 60 * 24,
        "day": 60 * 60 * 24,
        "days": 60 * 60 * 24,
        "w": 60 * 60 * 24 * 7,
        "week": 60 * 60 * 24 * 7,
        "weeks": 60 * 60 * 24 * 7
    }[time.replace(/\d/g, "")];

    let timeTotal = timeUnit * 1000 * Number(time.replace(/\D/g, ""));
    let timeNow = new Date().getTime();

    let unmuteTime = timeTotal + timeNow;

    DB.Guilds.collection("Info").updateOne({ "id": msg.guild.id, "members.id": userId }, { "$set": { "members.$.muted": unmuteTime }}, (err, results) => {});

    unmute(muted, mutedRole, timeTotal, msg.guild);
}

export default mute;