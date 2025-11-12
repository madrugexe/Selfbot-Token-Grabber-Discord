module.exports = {
    name: 'delflood',
    description: 'Delete a flood message',
    execute: async (client, message, args) => {
        if (args.length < 1) {
            await message.edit('❌ Usage: !delflood <number>');
            return;
        }
        
        const userId = client.userId;
        const response = client.managers.flood.delFlood(userId, parseInt(args[0]));
        await message.edit(response);
    }
};