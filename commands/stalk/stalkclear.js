const { stalkManager } = require('../../managers/StalkManager');

module.exports = {
    name: 'stalkclear',
    description: 'Clear stalked messages',
    execute: async (client, message, args) => {
        const result = stalkManager.clearStalkedMessages();
        await message.channel.send(`🗑️ **MESSAGES CLEARED**: ${result}`);
        await message.delete().catch(() => {});
    }
};