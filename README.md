# Discord-EZ

Discord-EZ is my fourth attemption at a Discord bot. This time, I'm using a more general JS coding style, instead of my previous attempts. 

## Current commands:

### `ping`

Replies with "Pong!"

### `kauser [username/kaid]`

Gives information about a KA user

### `kaprogram [id]`

Gives information about a KA program

### `define [word]`

Provides a defintions list for the word

### `pronounce [word]`

Links a video of how to pronounce the word

### `translate [word(s)] [to]\* [from]\*`

Translates the word(s) from a variety of languages

### `reactrole [role name] [emoji]...`

Creates a react role where users can react with [emoji] for [role name]. Multiple roles and reaction can be included in one react role message by continuing the pattern

### `reactroleone [role name] [emoji]...`

Creates a react role where users can react with [emoji] for [role name]. Multiple roles can be included, but user can only react to get one. Ideal for either or roles

### `poll [option] [emoji]...`

Creates a poll where users can vote for [option] with [emoji]. Mutliple options and emojis can be included in one poll by contuing the pattern. Each user can only vote with one emoji

### `diebot`

Clears bot messages

### `clear [number]\*`

Clears [number] messages from the channel or 99 by default

### `clearall`

Completely resets the channel messages

### `mute [user] [time]\* [reason]\*`

Mutes [user] for [time] or a week by default

### `unmute [user]`

Unmutes a muted user early

### `addword`

Adds a word to a list of banned words

### `removeword`

Removes a word from a list of banned words

### `prefix [new prefix]*`

States prefix or sets a new one

### `warn [user] [reason]`

Stores a warning for `[user]` about `[reason]`

### `infractions [user]`

Shows stored warnings/infractions for `[user]`

### `gettext`

Lists the text from any PNG or JPEG files attached

### `funnytext [filters]...\* [message]`

Posts a message through a webhook as the user put through one or more filters (uwu, owo, blarb, or, piglatin reverse)

### `invite`

Sends the bot invite

### `github`

Sends the bot GitHub repo

### `avatar [user]*`

Sends a larger picture of the user or sender's avatar

## Additional features:

### Censoring

Words added with `addword` become censored words. These words are searched for in each message. If one is found, the message is deleted. Here's the exciting part: the message is reposted through a wewbhook which looks like the original poster, except all banned words are replaced with asterisks to censor

### Ghost pings

Ghost pings are detected and reposted (Without a second ping) in the same way as censored messages

### Welcome messages

New users are welcomed automatically. If roles and rules channels can be found, they will be mentioned in the welcome channel as places to check out

### Persistant roles

Roles are saved and reassigned if an old member rejoins so they don't have to go through the hassle of reaction roles, or, even worse, an admin has to manually reassign roles

## Invite

https://discord.com/api/oauth2/authorize?client_id=886933964537880617&permissions=8&scope=bot