module.exports = {
    name: 'mute',
    description: 'Mute a user',
    execute: async (client, message, args) => {
        if (!message.guild) {
            return message.edit('❌ This command can only be used in a server.');
        }

        if (!message.member.permissions.has('MODERATE_MEMBERS')) {
            return message.edit('❌ You need the "Moderate Members" permission to use this command.');
        }

        const target = message.mentions.members.first();
        if (!target) {
            return message.edit('❌ Please mention a user to mute.');
        }

        if (!target.moderatable) {
            return message.edit('❌ I cannot mute this user. They may have higher permissions than me.');
        }

        try {
            // Mute for 10 minutes by default
            const muteTime = 10 * 60 * 1000; // 10 minutes in milliseconds
            await target.timeout(muteTime, 'Muted by command');
            await message.edit(`✅ Successfully muted ${target.user.tag} for 10 minutes`);
        } catch (error) {
            console.error('Mute error:', error);
            await message.edit('❌ Failed to mute the user.');
        }
    }
};