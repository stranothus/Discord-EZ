import unmute from "../utils/unmute.mjs";

async function guildMemberAdd(user) {
    let guild = user.guild;
    let welcome = guild.channels.cache.find(v => /welcome/i.test(v.name));
    if(!welcome) return;
    let rules = guild.channels.cache.find(v => /rules/i.test(v.name));
    let roles = guild.channels.cache.find(v => /roles/i.test(v.name));

    welcome.send(`Welcome, <@!${user.user.id}>!${rules ? ` Make sure to read the rules in <#${rules.id}>` : ""}${rules && roles ? " and" : rules ? "!" : ""}${roles ? ` and grab some roles  <#${roles.id}>!` : ""}`);

    let wasMember = await DB.Guilds.collection("Info").findOne({ "id": guild.id, "members.id": user.user.id });

    if(user.user.bot) return;
    
    if(!wasMember) {
        DB.Guilds.collection("Info").updateOne({ "id": guild.id }, { "$push": { "members": {
            "id": user.user.id,
            "muted": false,
            "roles": user.member ? user.member.roles || [] : []
        }}}, () => {});
    } else {
        let DBUser = wasMember.members.filter(e => e.id === user.user.id)[0];
        let roles = DBUser.roles;

        for(let i = 0; i < roles.length; i++) {
            let role = await guild.roles.fetch(roles[i]);

            if(role) {
                user.roles.add(role);
            }
        }

        if(DBUser.muted) {
            let mutedRole = guild.roles.cache.find(x => /muted/i.test(x.name)) || await guild.roles.create({ name: "Muted", permissions: [] });
            let mutedUser = await guild.members.fetch(user.user.id);
            let timeMuted = DBUser.muted - new Date().getTime();
            
            unmute(mutedUser, mutedRole, timeMuted, guild);
        }
    }
}

export default guildMemberAdd;