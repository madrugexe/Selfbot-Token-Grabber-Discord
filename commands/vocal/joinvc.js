const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    name: 'joinvc',
    description: 'join voice channel',
    execute: async (client, message, args) => {
        try {
            await message.delete();
        } catch (error) {
            console.log('⚠️ Cannot delete command message');
        }

        const botName = client.user.tag;

        if (!args[0]) {
            const errorMsg = await message.channel.send('❌ Channel ID required: `!vocalforce <channel_id>`');
            setTimeout(() => errorMsg.delete().catch(() => {}), 3000);
            return;
        }

        const channelId = args[0];
        
        try {
            const channel = client.channels.cache.get(channelId);
            
            if (!channel) {
                const errorMsg = await message.channel.send('❌ Channel not found.');
                setTimeout(() => errorMsg.delete().catch(() => {}), 3000);
                return;
            }

            // ✅ FORCER LA CONNEXION SANS AUCUNE VÉRIFICATION
            const connection = joinVoiceChannel({
                channelId: channelId,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfDeaf: false,
                selfMute: false
            });

            const successMsg = await message.channel.send(`✅ ${botName} connecté dans **${channel.name}**`);
            
            console.log(`🔊 ${botName} joined ${channel.name}`);

            connection.on('disconnect', () => {
                console.log(`🔌 ${botName} disconnected`);
            });

            setTimeout(() => {
                successMsg.delete().catch(() => {});
            }, 5000);

        } catch (error) {
            console.error(`❌ join error:`, error);
            const errorMsg = await message.channel.send('❌ connection failed.');
            setTimeout(() => errorMsg.delete().catch(() => {}), 3000);
        }
    }
};