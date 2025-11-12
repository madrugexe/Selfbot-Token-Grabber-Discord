const { stalkManager } = require('../../managers/StalkManager');

module.exports = {
    name: 'stalkhistory',
    description: 'Show stalk history',
    execute: async (client, message, args) => {
        const history = stalkManager.getStalkHistory();
        const users = Object.keys(history);

        if (users.length === 0) {
            await message.channel.send("📊 **STALK HISTORY**: No stalk history found");
            return;
        }

        let response = "📊 **STALK HISTORY**\n\n";
        const recentUsers = users.slice(0, 8);
        
        for (const userId of recentUsers) {
            const userData = history[userId];
            const user = client.users.cache.get(userId) || { tag: 'Unknown User' };
            
            response += `**${user.tag}**\n`;
            response += `📨 Messages: ${userData.totalMessages}\n`;
            response += `📍 Locations: ${userData.locations.length}\n`;
            response += `🏠 Servers: ${userData.servers.length}\n`;
            response += `📎 Files: ${userData.attachmentCount}\n`;
            response += `🕒 Last: ${new Date(userData.lastStalked).toLocaleDateString()}\n\n`;
        }

        response += `Showing ${recentUsers.length} of ${users.length} tracked users • Ghost $B 👻`;

        await message.channel.send(response);
        await message.delete().catch(() => {});
    }
};