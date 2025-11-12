const { stalkManager } = require('../../managers/StalkManager');

module.exports = {
    name: 'stalkstatus',
    description: 'Show stalk status',
    execute: async (client, message, args) => {
        const status = stalkManager.getStatus();
        
        if (!status.active) {
            await message.channel.send("🔍 **STALK STATUS**: No active stalk\n💡 Use `!stalk @user` to start monitoring");
            return;
        }

        let response = "🔍 **ACTIVE STALK**\n\n";
        response += `🎯 **TARGET**: ${status.target}\n`;
        response += `📊 **MESSAGES**: ${status.messageCount}\n`;
        response += `⏰ **STARTED**: ${new Date(status.startTime).toLocaleString()}\n`;
        response += `🏠 **SERVERS**: ${status.servers.length}\n`;
        response += `📍 **LOCATIONS**: ${status.locations.length}\n`;
        response += `📎 **FILE TYPES**: ${status.attachmentTypes.length}\n\n`;
        response += "Ghost $B 👻 • Real-time monitoring active";

        await message.channel.send(response);
        await message.delete().catch(() => {});
    }
};