async function muterole(guild) {
    let id = (await DB.Guilds.collection("Info").findOne({ "id": guild.id })).moderation.muteRole;
    let role = await guild.roles.fetch(id);
    
    if(!role) {
        role = await guild.roles.create({ name: "Muted", permissions: [] });
        DB.Guilds.collection("Info").updateOne({ "id": guild.id }, { "moderation": { "mutedRole": role.id}});
    }

    return role;
}

export default muterole;