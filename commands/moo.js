const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('moo')
		.setDescription('moo'),
	async execute(interaction) {
		await interaction.reply('moo');
	},
};
