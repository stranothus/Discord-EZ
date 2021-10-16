# How the database should work

The database needs to store basic information about each guild, at the very least. It should store

- Guild ID
- Guild Name
- Guild Members
    - Infractions
        - Reason
        - Punishment
        - By

For general purposes. It also needs to be able to store

- Reaction Roles
    - Message ID
    - Roles corresponding to reactions
- Banned Words
    - Word
    - Reason
    - Execute
- Moderation Specifics
    - Spam limit
    - Spam ignore
    - Current mutes
        - User
        - Duration
        - Reason
    - Infractions log
        - User
        - Reason
        - Punishment
        - By