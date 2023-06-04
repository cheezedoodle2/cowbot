import { SlashCommandBuilder } from '@discordjs/builders';

let data = new SlashCommandBuilder()
	.setName('moo')
	.setDescription('moo');

async function execute(interaction) {
	await interaction.reply({content: 'moo'});
}

let command = {
	data: data,
	execute: execute
};

export { command }