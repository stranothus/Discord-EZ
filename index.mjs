// import express for Heroku
import express from "express";
const app = express();
app.get("/", (req, res) => res.send("Bot is running"));
app.listen(process.env.PORT);

// import general packages
import { Client } from "discord.js";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// import events
import guildCreate from "./events/guildCreate.mjs";
import ready from "./events/ready.mjs";
import guildMemberAdd from "./events/guildMemberAdd.mjs";
import guildDelete from "./events/guildDelete.mjs";
import guildMemberUpdate from "./events/guildMemberUpdate.mjs";
import messageDelete from "./events/messageDelete.mjs";
import messageCreate from "./events/messageCreate.mjs";

// initiate process.env
dotenv.config();

// initiate the database to the global scope
global.DB = {};
const DBConnected = new Promise((resolve, reject) => {
    MongoClient.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.${process.env.DB_NAME}.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        (err, db) => {
            if(err) console.error(err);

            DB = {
                DB: db,
                Guilds: db.db("Guilds")
            };

            console.log("DB connected");

            resolve(db);
        }
    );
});

// initiate the client to the global scope
global.client = new Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MEMBERS",
        "DIRECT_MESSAGES",
        "GUILD_PRESENCES"
    ]
});

// some general variables to the global scope
const token = process.env.TOKEN;
global.KAAPI = "https://www.khanacademy.org/api/internal";
global.DictAPI = "https://api.dictionaryapi.dev/api/v2/entries/en";


client.once("ready", ready); // bot startup
client.on("guildCreate", guildCreate); // guild startup
client.on("guildDelete", guildDelete); // guild remove
client.on("guildMemberAdd", guildMemberAdd); // handle member joining
client.on("guildMemberUpdate", guildMemberUpdate); // handle user updates
client.on("messageDelete", messageDelete); // handle ghost pings
client.on("messageCreate", messageCreate); // commands

DBConnected.then(() => {
    // start bot
    client.login(token);
});