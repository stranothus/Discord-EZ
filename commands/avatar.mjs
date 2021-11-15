async function avatar(msg, args) {
    let user = args.length ? /\d{17,19}/.test(args[0]) ? msg.guild.members.cache.find(v => v.user.id == args[0].match(/\d{17,19}/)[0]).user : undefined : msg.author;

    if(!user) {
        msg.channel.send("Could not find an avatar for " + args[0]);
        return;
    }

    msg.channel.send(user.avatarURL(true));
}

export default avatar;