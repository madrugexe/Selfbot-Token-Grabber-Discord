const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'leavevc',
    description: 'Leave voice channel - ULTIMATE VERSION',
    execute: async (client, message, args) => {
        try {
            await message.delete().catch(() => {});
        } catch (error) {
            console.log('⚠️ Cannot delete command message');
        }

        const botName = client.user.tag;

        try {
            // ✅ METHODE ULTIME: Tout essayer
            let disconnected = false;

            // 1. Essayer avec getVoiceConnection()
            client.guilds.cache.forEach(guild => {
                try {
                    const connection = getVoiceConnection(guild.id);
                    if (connection) {
                        connection.destroy();
                        disconnected = true;
                        console.log(`🔌 ${botName} disconnected from ${guild.name}`);
                    }
                } catch (e) {}
            });

            // 2. Attendre un peu
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 3. Vérifier si toujours connecté et réessayer
            client.guilds.cache.forEach(guild => {
                try {
                    const connection = getVoiceConnection(guild.id);
                    if (connection) {
                        connection.destroy();
                        disconnected = true;
                        console.log(`🔌 ${botName} force disconnected from ${guild.name}`);
                    }
                } catch (e) {}
            });

            if (disconnected) {
                const successMsg = await message.channel.send(`✅ ${botName} déconnecté`);
                setTimeout(() => successMsg.delete().catch(() => {}), 3000);
            } else {
                const errorMsg = await message.channel.send(`❌ ${botName} n'était pas connecté`);
                setTimeout(() => errorMsg.delete().catch(() => {}), 3000);
            }

        } catch (error) {
            console.error(`❌ LeaveVC ultimate error:`, error);
            const errorMsg = await message.channel.send('❌ Erreur de déconnexion');
            setTimeout(() => errorMsg.delete().catch(() => {}), 3000);
        }
    }
};