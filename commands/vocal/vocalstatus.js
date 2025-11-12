const joinvcModule = require('./joinvc');
const voiceConnections = joinvcModule.voiceConnections;
const getBotId = joinvcModule.getBotId;

module.exports = {
    name: 'vocalstatus', 
    description: 'Show voice status for this token',
    execute: async (client, message, args) => {
        try {
            await message.delete();
        } catch (error) {
            console.log('⚠️ Cannot delete command message');
        }

        const botId = getBotId(client);
        const botName = client.user.tag;
        const connectionInfo = voiceConnections.get(botId);

        let statusMessage = `🔊 **Status Vocal - ${botName}**\n\n`;

        if (!connectionInfo) {
            statusMessage += `🔇 **DÉCONNECTÉ**\n`;
            statusMessage += `Ce token n'est dans aucun channel vocal.\n`;
            statusMessage += `Utilisez \`!joinvc <channel_id>\` pour le connecter.`;
        } else {
            statusMessage += `✅ **CONNECTÉ**\n`;
            statusMessage += `📁 Channel: **${connectionInfo.channelName}**\n`;
            statusMessage += `🏠 Serveur: ${connectionInfo.guildName}\n`;
            statusMessage += `👤 Contrôlé par: <@${connectionInfo.controlledBy}>\n`;
            statusMessage += `⏰ Connecté: <t:${Math.floor(connectionInfo.joinedAt.getTime() / 1000)}:R>\n\n`;
            statusMessage += `🛑 Utilisez \`!leavevc\` pour déconnecter`;
        }

        const statusMsg = await message.channel.send(statusMessage);
        setTimeout(() => statusMsg.delete().catch(() => {}), 10000);
    }
};