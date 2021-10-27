import isAdmin from "../../utils/isAdmin.mjs";

function clearall(msg, args) {
    if(isAdmin(msg)) return;

    msg.channel.clone();
    msg.channel.delete();
}

export default clearall;