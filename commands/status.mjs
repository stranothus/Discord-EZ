function status(msg, args) {
    if(msg.author.id !== "653742791838662687") {
        msg.channel.send("Only my master can use this command");
        return;
    }

    client.user.setPresence({ activities: [{ name: args[0] || "Doing lots of nothing" }], status: args[1] || "online" });
}

export default status;