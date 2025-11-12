module.exports = {
    name: 'kick',
    description: 'Kick a user',
    execute: async (client, message, args) => {
        if (!message.guild) {
            return message.edit('❌ This command can only be used in a server.');
        }

        if (!message.member.permissions.has('KICK_MEMBERS')) {
            return message.edit('❌ You need the "Kick Members" permission to use this command.');
        }

        const target = message.mentions.members.first();
        if (!target) {
            return message.edit('❌ Please mention a user to kick.');
        }

        if (!target.kickable) {
            return message.edit('❌ I cannot kick this user. They may have higher permissions than me.');
        }

        try {
            await target.kick();
            await message.edit(`✅ Successfully kicked ${target.user.tag}`);
        } catch (error) {
            console.error('Kick error:', error);
            await message.edit('❌ Failed to kick the user.');
        }
    }
};