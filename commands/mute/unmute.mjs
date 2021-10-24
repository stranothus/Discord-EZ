function unmute(muted, mutedRole, time, guild) {
    setTimeout(() => {
        if(guild.members.resolve(muted.user.id)) {
            muted.roles.remove(mutedRole);
            DB.Guilds.collection("Info").updateOne({ "id": guild.id, "members.id": muted.id }, { "$set": { "members.$.muted": false }}, (err, results) => {});
        }
    }, time > 0 ? time : 1);
}

export default unmute;