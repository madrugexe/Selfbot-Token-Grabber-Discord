module.exports = {
    name: 'modifflood',
    description: 'Modify an existing flood message',
    execute: async (client, message, args) => {
        if (args.length < 2) {
            await message.edit('❌ Usage: !modifflood <number> <message>');
            return;
        }
        
        const userId = client.userId;
        const response = client.managers.flood.modifFlood(userId, parseInt(args[0]), args.slice(1).join(' '));
        await message.edit(response);
    }
};