module.exports = {
    name: 'clearflood',
    description: 'Clear the entire flood sequence',
    execute: async (client, message, args) => {
        const userId = client.userId;
        const response = client.managers.flood.clearFlood(userId);
        await message.edit(response);
    }
};