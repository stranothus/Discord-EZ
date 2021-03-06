import { MessageCollector, Permissions } from "discord.js";
import censor from "./censor.mjs";

/**
 * Sends a message as a user through a webhook
 * 
 * @typedef {import("discord.js")} TextChannel
 * @typedef {import("discord.js")} Member
 * 
 * @param {TextChannel} channel - the channel to message
 * @param {Member} author - the user to message as
 * @param {string} content - the content to send
 * 
 * @returns {void}
 */
async function asUser(channel, author, content, edit, files) {
    if(!(channel.guild || channel.parent.guild).me.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS)) return;
    if(channel.type === "GUILD_PUBLIC_THREAD" || channel.type === "GUILD_PRIVATE_THREAD") {
        const webhook = (await channel.parent.fetchWebhooks()).filter(webhook => webhook.name === client.user.tag).first() || await channel.parent.createWebhook(client.user.tag);

        const censored = await webhook.send({
            "content": content,
            "avatarURL": `https://cdn.discordapp.com/avatars/${author.id || author.user.id}/${author.avatar || author.user.avatar}.png`,
            "username": author.displayName || author.username,
            "allowedMentions": {
                "roles": [],
                "users": [],
                "parse": []
            },
            "threadId": channel.id,
            "files": files
        });

        if(!edit) return;

        const collector = new MessageCollector(channel, {
            time: 1000 * 60,
            filter: msg => {
                if(!msg.reference) return false;
                if(msg.reference.messageId !== censored.id) return false;
                if(msg.author.id !== author.id) return false;

                return true;
            }
        });

        collector.on("collect", async msg => {
            const action = msg.content.match(/^(edit|delete):?/i);

            if(!action) return;

            switch(action[0].replace(/:/, "")) {
                case "edit": 
                    await webhook.editMessage(censored.id, {
                        "content": await censor(msg.content.replace(/^edit:/, ""), msg.guild),
                        "avatarURL": `https://cdn.discordapp.com/avatars/${author.id || author.user.id}/${author.avatar || author.user.avatar}.png`,
                        "username": author.displayName || author.username,
                        "allowedMentions": {
                            "roles": [],
                            "users": [],
                            "parse": []
                        },
                        "threadId": channel.id,
                        "files": msg.attachments
                    });
                break;
                case "delete":
                    await webhook.deleteMessage(censored.id, channel.id);
                break;
            }

            msg.delete();
        });
    } else {
        const webhook = (await channel.fetchWebhooks()).filter(webhook => webhook.name === client.user.tag).first() || await channel.createWebhook(client.user.tag);

        const censored =  await webhook.send({
            "content": content,
            "avatarURL": `https://cdn.discordapp.com/avatars/${author.id || author.user.id}/${author.avatar || author.user.avatar}.png`,
            "username": author.displayName || author.username,
            "allowedMentions": {
                "roles": [],
                "users": [],
                "parse": []
            },
            "files": files
        });

        if(!edit) return;

        const collector = new MessageCollector(channel, {
            time: 1000 * 60,
            filter: msg => {
                if(!msg.reference) return false;
                if(msg.reference.messageId !== censored.id) return false;
                if(msg.author.id !== author.id) return false;

                return true;
            }
        });

        collector.on("collect", async msg => {
            const action = msg.content.match(/^(edit|delete):?/i);

            if(!action) return;

            switch(action[0].replace(/:/, "")) {
                case "edit": 
                    await webhook.editMessage(censored.id, {
                        "content": await censor(msg.content.replace(/^edit:/, ""), msg.guild),
                        "avatarURL": `https://cdn.discordapp.com/avatars/${author.id || author.user.id}/${author.avatar || author.user.avatar}.png`,
                        "username": author.displayName || author.username,
                        "allowedMentions": {
                            "roles": [],
                            "users": [],
                            "parse": []
                        },
                        "files": msg.attachments
                    });
                break;
                case "delete":
                    await webhook.deleteMessage(censored.id);
                break;
            }

            msg.delete();
        });
    }
}

export default asUser;