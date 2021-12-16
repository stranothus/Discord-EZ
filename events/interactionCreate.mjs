import { Permissions } from "discord.js";

function interactionCreate(interaction) {
    if(interaction.guild && !interaction.guild.me.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return;

	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		if(!command.DMs && !interaction.guild) {
			interaction.reply("This command is not intended for direct message use :(");
			return;
		}
		command.execute(interaction);
	} catch (error) {
		console.error(error);
		interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
}

export default interactionCreate;