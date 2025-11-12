module.exports = {
    name: 'ban',
    description: 'Ban a user',
    execute: async (client, message, args) => {
        if (!message.guild) {
            return message.edit('❌ This command can only be used in a server.');
        }

        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.edit('❌ You need the "Ban Members" permission to use this command.');
        }

        const target = message.mentions.members.first();
        if (!target) {
            return message.edit('❌ Please mention a user to ban.');
        }

        if (!target.bannable) {
            return message.edit('❌ I cannot ban this user. They may have higher permissions than me.');
        }

        try {
            await target.ban();
            await message.edit(`✅ Successfully banned ${target.user.tag}`);
        } catch (error) {
            console.error('Ban error:', error);
            await message.edit('❌ Failed to ban the user.');
        }
    }
};