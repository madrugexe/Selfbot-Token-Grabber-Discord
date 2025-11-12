module.exports = {
    name: 'antigroup',
    description: 'Enable/disable anti-group',
    execute: async (client, message, args) => {
        if (args.length === 0) {
            const status = client.managers.antiGroup.getAntiGroupStatus(client.userId);
            await message.edit(`🔒 Anti-Group: ${status ? '🟢 ENABLED' : '🔴 DISABLED'}\nUsage: !antigroup <on/off>`);
            return;
        }

        const action = args[0].toLowerCase();
        if (action === 'on' || action === 'activate' || action === 'true') {
            const response = client.managers.antiGroup.setAntiGroup(client.userId, true);
            client.managers.antiGroup.setupAntiGroupHandler(client, client.userId);
            await message.edit(response);
        } else if (action === 'off' || action === 'desactivate' || action === 'false') {
            const response = client.managers.antiGroup.setAntiGroup(client.userId, false);
            client.managers.antiGroup.removeAntiGroupHandler(client, client.userId);
            await message.edit(response);
        } else {
            await message.edit('❌ Usage: !antigroup <on/off>');
        }
    }
};