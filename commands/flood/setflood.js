module.exports = {
    name: 'setflood',
    description: 'Set a flood message',
    execute: async (client, message, args) => {
        if (args.length < 2) {
            await message.edit('❌ Usage: !setflood <number> <message>');
            return;
        }
        
        const userId = client.userId;
        const response = client.managers.flood.setFlood(userId, parseInt(args[0]), args.slice(1).join(' '));
        await message.edit(response);
    }
};