const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Displays the status of the $elf-Bot')
        .addStringOption(option => 
            option.setName('state')
                .setDescription('off to turn OFF, on to turn ON')
                .setRequired(true)
                .addChoices(
                    { name: 'OFF', value: 'off' },
                    { name: 'ON', value: 'on' }
                )
        ),
    async execute(interaction) {
        // Remplacez par les IDs autorisés (votre ID Discord)
       const allowedIDs = ['1398028386856603658, 558648865176289290'];
        
        if (!allowedIDs.includes(interaction.user.id)) {
            return interaction.reply({ content: '❌ You are not authorized to use this command.', ephemeral: true });
        }

        const state = interaction.options.getString('state');

        let statusText;
        if (state === 'off') {
            statusText = '**:red_circle: $elf-Bot: OFF**';
            // Logique pour éteindre le bot
        } else if (state === 'on') {
            statusText = '**:green_circle: $elf-Bot: ON**';
            // Logique pour allumer le bot
        }

        await interaction.reply({ content: statusText });
    }
};