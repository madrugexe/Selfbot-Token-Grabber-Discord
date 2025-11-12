module.exports = {
    name: 'stats',
    description: 'Show statistics',
    execute: async (client, message, args) => {
        const stats = `**📊 Statistics:**\n- Servers: ${client.guilds.cache.size}\n- Users: ${client.users.cache.size}\n- Channels: ${client.channels.cache.size}`;
        await message.edit(stats);
    }
};