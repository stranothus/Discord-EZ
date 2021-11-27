import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import dateToObj from "./../../utils/dateToObj.js";
import timeSince from "./../../utils/timeSince.js";

export default {
    data: new SlashCommandBuilder()
        .setName("kauser")
        .setDescription("Get information about a Khan Academy user")
        .addStringOption(option => option
            .setName("identifier")
            .setDescription("the username or kaid of the user to get info on")
            .setRequired(true)
        ),
    description: `kauser [username or kaid]\` makes me respond with the corresponding Khan Academy user information.`,
    category: "ka",
    DMs: true,
    execute: async function(interaction) {
        let user = interaction.options.getString("identifier");
        let data = (await fetch("https://www.khanacademy.org/api/internal/graphql/getFullUserProfile", {
            "headers": {
                "content-type": "application/json",
                "cookie": "fkey=0",
            },
            "body": `{
                \"operationName\":\"getFullUserProfile\",
                \"variables\":{
                    ${user.indexOf("kaid") + 1 ? `\"kaid\":\"${user}\"` : `\"username\":\"${user}\"`}
                },
                \"query\":\"query getFullUserProfile($kaid: String, $username: String) {\\n  user(kaid: $kaid, username: $username) {\\n    id\\n    kaid\\n    key\\n    userId\\n    email\\n    username\\n    profileRoot\\n    gaUserId\\n    qualarooId\\n    isPhantom\\n    isDeveloper: hasPermission(name: \\\"can_do_what_only_admins_can_do\\\")\\n    isCurator: hasPermission(name: \\\"can_curate_tags\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isCreator: hasPermission(name: \\\"has_creator_role\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isPublisher: hasPermission(name: \\\"can_publish\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isModerator: hasPermission(name: \\\"can_moderate_users\\\", scope: GLOBAL)\\n    isParent\\n    isSatStudent\\n    isTeacher\\n    isDataCollectible\\n    isChild\\n    isOrphan\\n    isCoachingLoggedInUser\\n    canModifyCoaches\\n    nickname\\n    hideVisual\\n    joined\\n    points\\n    countVideosCompleted\\n    bio\\n    soundOn\\n    muteVideos\\n    showCaptions\\n    prefersReducedMotion\\n    noColorInVideos\\n    autocontinueOn\\n    newNotificationCount\\n    canHellban: hasPermission(name: \\\"can_ban_users\\\", scope: GLOBAL)\\n    canMessageUsers: hasPermission(name: \\\"can_send_moderator_messages\\\", scope: GLOBAL)\\n    isSelf: isActor\\n    hasStudents: hasCoachees\\n    hasClasses\\n    hasChildren\\n    hasCoach\\n    badgeCounts\\n    homepageUrl\\n    isMidsignupPhantom\\n    includesDistrictOwnedData\\n    preferredKaLocale {\\n      id\\n      kaLocale\\n      status\\n      __typename\\n    }\\n    underAgeGate {\\n      parentEmail\\n      daysUntilCutoff\\n      approvalGivenAt\\n      __typename\\n    }\\n    authEmails\\n    signupDataIfUnverified {\\n      email\\n      emailBounced\\n      __typename\\n    }\\n    pendingEmailVerifications {\\n      email\\n      unverifiedAuthEmailToken\\n      __typename\\n    }\\n    tosAccepted\\n    shouldShowAgeCheck\\n    __typename\\n  }\\n  actorIsImpersonatingUser\\n}\\n\"
            }`,
          "method": "POST"
        })
        .then(response => response.json())).data.user;
    
        if(!data) {
            interaction.reply({ content: "The KA user could not be found. Please double check your query", ephemeral: true });
            return;
        }
    
        let joinedObj = dateToObj(data.joined ? new Date(data.joined) : new Date());
        let sinceJoined = timeSince(joinedObj) || "Secret";
    
        let embed = new MessageEmbed()
            .setColor("#FAC000")
            .setTitle("**" + data.nickname + "**")
            .setURL("https://www.khanacademy.org/profile/" + data.kaid)
            .setDescription(`
                **@${data.username}** - ${data.bio}\n
                **Joined:** ${sinceJoined}
                **Energy Points:** ${Number(data.points).toLocaleString()}
                **Videos Completed:** ${Number(data.countVideosCompvared).toLocaleString()}
                **KAID:** ${data.kaid}`);
    
        interaction.reply({ "embeds": [embed] });
    },
    executeText: async function(msg, args) {
        let prefix = msg.guild ? (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix : "{prefix}";
    
        if(!args[0]) {
            msg.channel.send("Use `" + prefix + "help kauser` to learn how to use this command");
            return;
        }
    
        let data = (await fetch("https://www.khanacademy.org/api/internal/graphql/getFullUserProfile", {
            "headers": {
                "content-type": "application/json",
                "cookie": "fkey=0",
            },
            "body": `{
                \"operationName\":\"getFullUserProfile\",
                \"variables\":{
                    ${args[0].indexOf("kaid") + 1 ? `\"kaid\":\"${args[0]}\"` : `\"username\":\"${args[0]}\"`}
                },
                \"query\":\"query getFullUserProfile($kaid: String, $username: String) {\\n  user(kaid: $kaid, username: $username) {\\n    id\\n    kaid\\n    key\\n    userId\\n    email\\n    username\\n    profileRoot\\n    gaUserId\\n    qualarooId\\n    isPhantom\\n    isDeveloper: hasPermission(name: \\\"can_do_what_only_admins_can_do\\\")\\n    isCurator: hasPermission(name: \\\"can_curate_tags\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isCreator: hasPermission(name: \\\"has_creator_role\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isPublisher: hasPermission(name: \\\"can_publish\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isModerator: hasPermission(name: \\\"can_moderate_users\\\", scope: GLOBAL)\\n    isParent\\n    isSatStudent\\n    isTeacher\\n    isDataCollectible\\n    isChild\\n    isOrphan\\n    isCoachingLoggedInUser\\n    canModifyCoaches\\n    nickname\\n    hideVisual\\n    joined\\n    points\\n    countVideosCompleted\\n    bio\\n    soundOn\\n    muteVideos\\n    showCaptions\\n    prefersReducedMotion\\n    noColorInVideos\\n    autocontinueOn\\n    newNotificationCount\\n    canHellban: hasPermission(name: \\\"can_ban_users\\\", scope: GLOBAL)\\n    canMessageUsers: hasPermission(name: \\\"can_send_moderator_messages\\\", scope: GLOBAL)\\n    isSelf: isActor\\n    hasStudents: hasCoachees\\n    hasClasses\\n    hasChildren\\n    hasCoach\\n    badgeCounts\\n    homepageUrl\\n    isMidsignupPhantom\\n    includesDistrictOwnedData\\n    preferredKaLocale {\\n      id\\n      kaLocale\\n      status\\n      __typename\\n    }\\n    underAgeGate {\\n      parentEmail\\n      daysUntilCutoff\\n      approvalGivenAt\\n      __typename\\n    }\\n    authEmails\\n    signupDataIfUnverified {\\n      email\\n      emailBounced\\n      __typename\\n    }\\n    pendingEmailVerifications {\\n      email\\n      unverifiedAuthEmailToken\\n      __typename\\n    }\\n    tosAccepted\\n    shouldShowAgeCheck\\n    __typename\\n  }\\n  actorIsImpersonatingUser\\n}\\n\"
            }`,
          "method": "POST"
        })
        .then(response => response.json())).data.user;
    
        if(!data) {
            msg.channel.send("The KA user could not be found. Please double check your query");
            return;
        }
    
        let joinedObj = dateToObj(data.joined ? new Date(data.joined) : new Date());
        let sinceJoined = timeSince(joinedObj) || "Secret";
    
        let embed = new MessageEmbed()
            .setColor("#FAC000")
            .setTitle("**" + data.nickname + "**")
            .setURL("https://www.khanacademy.org/profile/" + data.kaid)
            .setDescription(`
                **@${data.username}** - ${data.bio}\n
                **Joined:** ${sinceJoined}
                **Energy Points:** ${Number(data.points).toLocaleString()}
                **Videos Completed:** ${Number(data.countVideosCompvared).toLocaleString()}
                **KAID:** ${data.kaid}`);
    
        msg.channel.send({ "embeds": [embed] });
    }
};