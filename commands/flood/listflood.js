module.exports = {
    name: 'listflood',
    description: 'Show all flood messages',
    execute: async (client, message, args) => {
        const userId = client.userId;
        const response = client.managers.flood.listFlood(userId);
        await message.edit(response);
    }
};