module.exports = {
    name: 'flood',
    description: 'Start flood with specified delay',
    execute: async (client, message, args) => {
        const delay = args[0] ? parseInt(args[0]) : client.config.defaultDelay;
        try {
            await message.delete();
            console.log(`🗑️ Command message deleted for ${client.userId}`);
        } catch (deleteError) {
            console.error('❌ Message deletion error:', deleteError);
        }
        
        const response = await client.managers.flood.startFlood(client.userId, message.channel, delay);
        const confirmMsg = await message.channel.send(response);
        setTimeout(async () => {
            try {
                await confirmMsg.delete();
            } catch (e) {
                console.error('❌ Confirmation message deletion error:', e);
            }
        }, 3000);
    }
};