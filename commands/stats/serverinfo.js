module.exports = {
    name: 'serverinfo',
    description: 'Server information',
    execute: async (client, message, args) => {
        if (!message.guild) {
            await message.edit('❌ This command works only on a server.');
            return;
        }
        const guildInfo = `**🏰 ${message.guild.name}:**\n- Members: ${message.guild.memberCount}\n- Roles: ${message.guild.roles.cache.size}\n- Channels: ${message.guild.channels.cache.size}`;
        await message.edit(guildInfo);
    }
};