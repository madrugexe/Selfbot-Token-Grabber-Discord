module.exports = {
    name: 'coinflip',
    description: 'Flip a coin',
    execute: async (client, message, args) => {
        const result = Math.random() < 0.5 ? 'Heads 🪙' : 'Tails 🪙';
        message.channel.send(`🎲 Flip result: ${result}`);
    }
};