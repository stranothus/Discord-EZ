import censor from "../../utils/censor.mjs";
import asUser from "../../utils/asUser.mjs";

async function binary(msg, args) {
    let text = args.join(" ");

    if(text.replace(/0|1|\s/g, "")) {
        text = text.split("").map(v => "0" + v.charCodeAt(0).toString(2)).join(" ");
    } else {
        text = await censor(text.split(" ").map(v => String.fromCharCode(parseInt(v, 2))).join(""), msg.guild);
    }

    asUser(msg.channel, msg.author, text);
    msg.delete();
}

export default binary;