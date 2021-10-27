import ytsr from "ytsr";

async function pronounce(msg, args) {
    let prefix = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix;

    if(!args[0]) {
        msg.channel.send("Use `" + prefix + "help pronounce` to learn how to use this command");
        return;
    }

    let results = await ytsr(`Pronounce ${args[0]}`, { limit:  1 });
    
    if(!results.items) {
        msg.channel.send("That word's pronunciation could not be found. Please double check your query");
        return;
    }
    msg.channel.send(results.items[0].url);
}

export default pronounce;