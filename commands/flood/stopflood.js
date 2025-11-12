module.exports = {
    name: 'stopflood',
    description: 'Stop flood',
    execute: async (client, message, args) => {
        const userId = client.userId;
        const response = client.managers.flood.stopFlood(userId);
        await message.edit(response);
    }
};