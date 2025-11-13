const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const allowedIDs = [''];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Send a professional announcement with embed')
        .addStringOption(option =>
            option
                .setName('message')
                .setDescription('The main announcement content')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('title')
                .setDescription('Announcement title')
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName('color')
                .setDescription('Embed color (red, green, blue, yellow, purple)')
                .setRequired(false)
                .addChoices(
                    { name: '🔴 Red', value: '#FF0000' },
                    { name: '🟢 Green', value: '#00FF00' },
                    { name: '🔵 Blue', value: '#0099FF' },
                    { name: '🟡 Yellow', value: '#FFFF00' },
                    { name: '🟣 Purple', value: '#9B59B6' },
                    { name: '⚪ Silver', value: '#95A5A6' }
                )
        )
        .addStringOption(option =>
            option
                .setName('ping')
                .setDescription('Who to ping')
                .setRequired(false)
                .addChoices(
                    { name: '👥 Everyone', value: 'everyone' },
                    { name: '📢 Here', value: 'here' },
                    { name: '🔕 No Ping', value: 'none' }
                )
        )
        .addStringOption(option =>
            option
                .setName('thumbnail')
                .setDescription('Thumbnail URL (optional)')
                .setRequired(false)
        ),

    async execute(interaction) {
        // Authorization check
        if (!allowedIDs.includes(interaction.user.id)) {
            return await interaction.reply({
                content: '❌ You are not authorized to use this command.',
                ephemeral: true
            });
        }

        const message = interaction.options.getString('message');
        const title = interaction.options.getString('title') || '📢 Important Announcement';
        const color = interaction.options.getString('color') || '#0099FF';
        const pingType = interaction.options.getString('ping') || 'everyone';
        const thumbnail = interaction.options.getString('thumbnail');

        // Determine ping content
        let pingContent = '';
        switch (pingType) {
            case 'everyone':
                pingContent = '@everyone';
                break;
            case 'here':
                pingContent = '@here';
                break;
            case 'none':
                pingContent = '';
                break;
        }

        // Create professional embed
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(message)
            .setColor(color)
            .setTimestamp()
            .setFooter({ 
                text: `Announcement by ${interaction.user.tag} • ${interaction.guild.name}`,
                iconURL: interaction.user.displayAvatarURL() 
            });

        // Add thumbnail if provided
        if (thumbnail) {
            embed.setThumbnail(thumbnail);
        } else {
            // Default thumbnail
            embed.setThumbnail('https://media.discordapp.net/attachments/1432339876300460102/1432339929589092494/banner.webp?ex=6900b202&is=68ff6082&hm=04a141ea72113af11edb6553d6ee80822bdb81ce79da7219a82e35d88f142a6f&=&format=webp&width=599&height=899');
        }

        // Add author field
        embed.setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL()
        });

        try {
            // Acknowledge the command privately
            await interaction.deferReply({ ephemeral: true });
            
            // Send the announcement
            const announcement = await interaction.channel.send({
                content: pingContent,
                embeds: [embed]
            });

            // Add reaction to confirm
            await announcement.react('📢');
            
            // Confirm to the user
            await interaction.editReply({
                content: `✅ Announcement sent successfully! [Jump to message](${announcement.url})`
            });

        } catch (error) {
            console.error('❌ Announce command error:', error);
            await interaction.editReply({
                content: '❌ Error sending announcement! Make sure I have proper permissions.'
            });
        }
    }

};
