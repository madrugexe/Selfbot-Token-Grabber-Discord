module.exports = {
    name: 'delsalon',
    description: 'Delete a specific server channel',
    execute: async (client, message, args) => {
        if (!message.guild) {
            return message.edit('❌ This command can only be used in a server.');
        }

        if (!message.member.permissions.has('MANAGE_CHANNELS')) {
            return message.edit('❌ You need the "Manage Channels" permission to use this command.');
        }

        const channelName = args.join(' ');
        if (!channelName) {
            return message.edit('❌ Please specify a channel name to delete.');
        }

        const channel = message.guild.channels.cache.find(c => c.name === channelName);
        if (!channel) {
            return message.edit(`❌ Channel "${channelName}" not found.`);
        }

        if (!channel.deletable) {
            return message.edit('❌ I cannot delete this channel.');
        }

        try {
            await channel.delete();
            await message.edit(`✅ Channel "${channelName}" deleted successfully.`);
        } catch (error) {
            console.error('Delete channel error:', error);
            await message.edit('❌ Failed to delete the channel.');
        }
    }
};