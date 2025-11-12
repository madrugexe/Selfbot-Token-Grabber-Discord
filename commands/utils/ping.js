module.exports = {
    name: 'ping',
    description: 'Show bot ping',
    execute: async (client, message, args) => {
        const latency = Date.now() - message.createdTimestamp;
        await message.edit(`🏓 Pong! ${latency}ms`);
    }
};