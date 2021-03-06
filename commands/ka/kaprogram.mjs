import { MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import dateToObj from "./../../utils/dateToObj.js";
import timeSince from "./../../utils/timeSince.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("kaprogram")
        .setDescription("Get information about a Khan Academy program")
        .addIntegerOption(option => option
            .setName("id")
            .setDescription("the id of the program to get")
            .setRequired(true)
        ),
    description: `kaprogram [program ID]\` makes me respond with the corresponding Khan Academy program information.`,
    category: "ka",
    DMs: true,
    execute: async function(interaction) {
        let endpoint = `${KAAPI}/scratchpads/${interaction.options.getInteger("id")}?format=pretty`;
        let data = await fetch(endpoint).then(response => response.json()).then(data => { return data; });
    
        if(!data) {
            interaction.reply({ content: "The KA program could not be found. Please double check your query", ephemeral: true });
            return;
        }

        let authorData = (await fetch("https://www.khanacademy.org/api/internal/graphql/getFullUserProfile", {
            "headers": {
                "content-type": "application/json",
                "cookie": "fkey=0",
            },
            "body": `{
                \"operationName\":\"getFullUserProfile\",
                \"variables\":{
                    \"kaid\":\"${data.kaid}\"
                },
                \"query\":\"query getFullUserProfile($kaid: String, $username: String) {\\n  user(kaid: $kaid, username: $username) {\\n    id\\n    kaid\\n    key\\n    userId\\n    email\\n    username\\n    profileRoot\\n    gaUserId\\n    qualarooId\\n    isPhantom\\n    isDeveloper: hasPermission(name: \\\"can_do_what_only_admins_can_do\\\")\\n    isCurator: hasPermission(name: \\\"can_curate_tags\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isCreator: hasPermission(name: \\\"has_creator_role\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isPublisher: hasPermission(name: \\\"can_publish\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isModerator: hasPermission(name: \\\"can_moderate_users\\\", scope: GLOBAL)\\n    isParent\\n    isSatStudent\\n    isTeacher\\n    isDataCollectible\\n    isChild\\n    isOrphan\\n    isCoachingLoggedInUser\\n    canModifyCoaches\\n    nickname\\n    hideVisual\\n    joined\\n    points\\n    countVideosCompleted\\n    bio\\n    soundOn\\n    muteVideos\\n    showCaptions\\n    prefersReducedMotion\\n    noColorInVideos\\n    autocontinueOn\\n    newNotificationCount\\n    canHellban: hasPermission(name: \\\"can_ban_users\\\", scope: GLOBAL)\\n    canMessageUsers: hasPermission(name: \\\"can_send_moderator_messages\\\", scope: GLOBAL)\\n    isSelf: isActor\\n    hasStudents: hasCoachees\\n    hasClasses\\n    hasChildren\\n    hasCoach\\n    badgeCounts\\n    homepageUrl\\n    isMidsignupPhantom\\n    includesDistrictOwnedData\\n    preferredKaLocale {\\n      id\\n      kaLocale\\n      status\\n      __typename\\n    }\\n    underAgeGate {\\n      parentEmail\\n      daysUntilCutoff\\n      approvalGivenAt\\n      __typename\\n    }\\n    authEmails\\n    signupDataIfUnverified {\\n      email\\n      emailBounced\\n      __typename\\n    }\\n    pendingEmailVerifications {\\n      email\\n      unverifiedAuthEmailToken\\n      __typename\\n    }\\n    tosAccepted\\n    shouldShowAgeCheck\\n    __typename\\n  }\\n  actorIsImpersonatingUser\\n}\\n\"
            }`,
          "method": "POST"
        })
        .then(response => response.json())).data.user;
        
        let createdObj = dateToObj(data.created ? new Date(data.created) : new Date());
        let sinceCreated = timeSince(createdObj);
    
        let embed = new MessageEmbed()
            .setColor("#FAC000")
            .setTitle("**" + data.title + "** (" + data.userAuthoredContentType.toUpperCase() + ")")
            .setURL("https://www.khanacademy.org/profile/" + data.kaid)
            .setDescription(`
                **[${authorData.nickname}](https://www.khanacademy.org/profile/${authorData.username}) - @${authorData.username}**\n
                **Created:** ${sinceCreated}
                **Votes:** ${Number(data.sumVotesIncremented || 1).toLocaleString()}
                **Spin-offs:** ${Number(data.spinoffCount || 0).toLocaleString()}
                **Flags:** ${JSON.stringify(data.flags)}
                **Hidden from HotList:** ${data.hideFromHotlist}
                **Guardian approved:** ${data.definitelyNotSpam}
                **Child program:** ${data.byChild}
                **Full data:** ${endpoint}`)
            .setThumbnail(data.imageUrl)
    
        interaction.reply({ "embeds": [embed] });
    },
    executeText: async function(msg, args) {
        let prefix = msg.guild ? (await DB.Guilds.collection("Info").findOne({ "id": msg.guild.id })).prefix : "{prefix}";
    
        if(!args[0]) {
            msg.channel.send("Use `" + prefix + "help kaporgram` to learn how to use this command");
            return;
        }
    
        let endpoint = `${KAAPI}/scratchpads/${args[0]}?format=pretty`;
        let data = await fetch(endpoint).then(response => response.json()).then(data => { return data; });
    
        if(!data) {
            msg.channel.send("The KA program could not be found. Please double check your query");
            return;
        }
    
        let authorEndpoint = `${api}/user/profile?kaid=${data.kaid}&format=pretty`;
        let authorData = await fetch(authorEndpoint).then(response => response.json()).then(data => { return data; });
        let createdObj = dateToObj(data.created ? new Date(data.created) : new Date());
        let sinceCreated = timeSince(createdObj);
    
        let embed = new MessageEmbed()
            .setColor("#FAC000")
            .setTitle("**" + data.title + "** (" + data.userAuthoredContentType.toUpperCase() + ")")
            .setURL("https://www.khanacademy.org/profile/" + data.kaid)
            .setDescription(`
                **[${authorData.nickname}](https://www.khanacademy.org/profile/${authorData.username}) - @${authorData.username}**\n
                **Created:** ${sinceCreated}
                **Votes:** ${Number(data.sumVotesIncremented || 1).toLocaleString()}
                **Spin-offs:** ${Number(data.spinoffCount || 0).toLocaleString()}
                **Flags:** ${JSON.stringify(data.flags)}
                **Hidden from HotList:** ${data.hideFromHotlist}
                **Guardian approved:** ${data.definitelyNotSpam}
                **Child program:** ${data.byChild}
                **Full data:** ${endpoint}`)
            .setThumbnail(data.imageUrl)
    
        msg.channel.send({ "embeds": [embed] });
    }
};