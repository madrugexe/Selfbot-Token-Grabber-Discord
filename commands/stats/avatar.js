module.exports = {
    name: 'avatar',
    description: 'Show avatar',
    execute: async (client, message, args) => {
        const target = message.mentions.users.first() || message.author;
        const avatarURL = target.displayAvatarURL({ 
            dynamic: true, 
            size: 4096,
            format: 'png'
        });
        
        const userInfo = `
🖼️ **${target.tag.toUpperCase()} AVATAR**

🔗 **Direct link:** ${avatarURL}
🆔 **ID:** ${target.id}
📅 **Account created:** ${target.createdAt.toLocaleDateString('en-US')}
${target.bot ? '🤖 **Type:** Bot' : '👤 **Type:** User'}

*Use \`!banner @user\` to see banner*
    `.trim();
        
        await message.edit(userInfo);
    }
};