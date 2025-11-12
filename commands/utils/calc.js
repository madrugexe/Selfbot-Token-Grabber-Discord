module.exports = {
    name: 'calc',
    description: 'Calculate an expression',
    execute: async (client, message, args) => {
        try {
            const result = eval(args.join(' '));
            await message.edit(`🧮 Result: ${result}`);
        } catch {
            await message.edit('❌ Invalid expression.');
        }
    }
};