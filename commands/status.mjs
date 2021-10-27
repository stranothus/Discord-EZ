function status(msg, args) {
    console.log(msg.author);
    if(msg.author.id !== 653742791838662687) {
        msg.channel.send("Only my master can use this command");
        return;
    }

    msg.channel.send("You are my master");
}

export default status;