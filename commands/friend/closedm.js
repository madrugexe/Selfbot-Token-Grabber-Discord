module.exports = {
    name: 'closedm',
    description: 'Close all your DMs',
    execute: async (client, message, args) => {
        await message.edit("> **Ghost**").catch(() => false);
        message.delete().catch(() => false);

        client.channels.cache
            .filter(channel => channel.type === "DM" || channel.type === "GROUP_DM")
            .map(channel => channel.delete().catch(() => false));
    }
};