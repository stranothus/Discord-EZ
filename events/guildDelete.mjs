async function guildDelete(guild) {
    DB.Guilds.collection("Info").deleteOne({ id: guild.id });
}

export default guildDelete;