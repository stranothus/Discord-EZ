async function guildMemberUpdate(old, current) {
    const guildDB = await DB.Guilds.collection("Info").findOne({ "id": guild.id });

    if(!guildDB.persistroles) return;
    
    await DB.Guilds.collection("Info").updateOne({ "id": current.guild.id, "members.id": current.user.id }, { "$set": { "members.$.roles": current._roles }}, () => {});
}

export default guildMemberUpdate;