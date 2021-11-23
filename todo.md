# Todo:

1. Kick command
2. Logs which can be enabled or disabled
3. Extend possible `mute` time using @stranothus/patience
4. Redesign command argument formatting to allow for more complex command options
5. Create mutli-step command functionality
6. Think up more fun webhook possibilities
7. Set up webhooks for other services? __investigate__
8. Upload emoji?
9. Find a way to monetize
10. Add additional encryption commands
11. Owner only commands
12. Make piglatin filter better

# Register slash commands plan:

1. Convert all commands into proper exports. They should have
    1. A data property for the slash command
    2. An execute property for the slash command
    3. A description property for help
    4. A category for help
    5. Their current functionality for standard text commands
2. Get all commands
    - These need to be loaded from ./commands and look for files and sub-directories
    - They need to be found to load help from description, register from data, collected from execute for calling, and collected from standard for text calling
3. Convert events to proper exports. They should have
    1. A type property for on or once
    2. A name property for event type
    3. An execute property