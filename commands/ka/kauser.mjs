import { MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import dateToObj from "./../../utils/dateToObj.js";
import timeSince from "./../../utils/timeSince.js";

async function kauser(msg, args) {
    let prefix = (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix;

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
                \"username\":\"stranothus\"
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

    let joinedObj = dateToObj(data.dateJoined ? new Date(data.dateJoined) : new Date());
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

export default kauser;