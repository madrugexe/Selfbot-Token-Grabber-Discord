module.exports = {
    name: 'nitrotroll',
    description: 'Send fake nitro code to troll',
    execute: async (client, message, args) => {
        try {
            await message.edit(`https://discord.gift/Udzwm3hrQECQBnEEFFCEwdSq`);
        } catch (e) {
            console.error('❌ Nitrotroll error:', e);
        }
    }
};