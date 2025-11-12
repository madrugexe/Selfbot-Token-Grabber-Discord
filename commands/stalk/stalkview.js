const { stalkManager } = require('../../managers/StalkManager');

module.exports = {
    name: 'stalkview',
    description: 'Show stalked messages with file links',
    execute: async (client, message, args) => {
        try {
            const status = stalkManager.getStatus();
            if (!status.active) {
                await message.channel.send("❌ No active stalk! Use `!stalk @user`");
                return;
            }

            const messages = stalkManager.getStalkedMessages();
            if (messages.length === 0) {
                await message.channel.send(`📭 No messages from **${status.target}** yet`);
                return;
            }

            // Message avec liens des fichiers
            let response = `🔍 **Stalking ${status.target}**\n`;
            response += `📊 ${messages.length} messages captured\n\n`;
            
            const recentMessages = messages.slice(-8); // 8 derniers messages
            
            for (const msg of recentMessages) {
                const content = msg.content || "📷 Media";
                response += `**${msg.timestamp}** - ${content}\n`;
                
                if (msg.location) {
                    response += `📍 ${msg.location}\n`;
                }
                
                // ✅ AFFICHER LES LIENS DES FICHIERS
                if (msg.attachments && msg.attachments.length > 0) {
                    response += `📎 **Attachments (${msg.attachments.length}):**\n`;
                    
                    for (const att of msg.attachments.slice(0, 3)) { // Max 3 fichiers
                        const fileType = getFileType(att.contentType);
                        response += `${fileType} [${att.name || 'File'}](${att.url})\n`;
                    }
                    
                    if (msg.attachments.length > 3) {
                        response += `... and ${msg.attachments.length - 3} more files\n`;
                    }
                }
                
                response += "\n" + "─".repeat(30) + "\n\n";
            }

            await message.channel.send(response);
            await message.delete().catch(() => {});

        } catch (error) {
            console.error('Stalkview error:', error);
            await message.channel.send("❌ Error showing stalk data").catch(() => {});
        }
    }
};

// Fonction pour déterminer le type de fichier
function getFileType(contentType) {
    if (!contentType) return '📄';
    if (contentType.includes('image')) return '🖼️';
    if (contentType.includes('video')) return '🎥';
    if (contentType.includes('audio')) return '🎵';
    if (contentType.includes('pdf')) return '📕';
    return '📄';
}