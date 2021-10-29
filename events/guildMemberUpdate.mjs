async function guildMemberUpdate(old, current) {
    DB.Guilds.collection("Info").updateOne({ "id": current.guild.id, "members.id": current.user.id }, { "$set": { "members.$.roles": current._roles }}, () => {});
}

export default guildMemberUpdate;