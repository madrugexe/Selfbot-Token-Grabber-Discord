module.exports = {
    name: 'countflood',
    description: 'Show flood message count',
    execute: async (client, message, args) => {
        const userId = client.userId;
        const response = client.managers.flood.countFlood(userId);
        await message.edit(response);
    }
};