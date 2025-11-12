module.exports = {
    name: 'userinfo',
    description: 'User information',
    execute: async (client, message, args) => {
        const target = message.mentions.users.first() || message.author;
        const userInfo = `**👤 ${target.tag} Information:**\n- ID: ${target.id}\n- Created: ${target.createdAt.toLocaleDateString()}`;
        await message.edit(userInfo);
    }
};