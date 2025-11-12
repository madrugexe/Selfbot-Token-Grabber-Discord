const { stalkManager } = require('../../managers/StalkManager');

module.exports = {
    name: 'stopstalk',
    description: 'Stop stalking',
    execute: async (client, message, args) => {
        const result = stalkManager.stopStalk();
        await message.channel.send(`🛑 **STALK STOPPED**: ${result}`);
        await message.delete().catch(() => {});
    }
};