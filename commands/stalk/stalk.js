const { stalkManager } = require('../../managers/StalkManager');

module.exports = {
    name: 'stalk',
    description: 'Start stalking a user',
    execute: async (client, message, args) => {
        try {
            const user = message.mentions.users.first() || client.users.cache.get(args[0]);
            if (!user) {
                await message.channel.send("❌ Please mention a user!");
                return;
            }

            if (user.id === client.user.id || user.id === message.author.id) {
                await message.channel.send("❌ Invalid target!");
                return;
            }

            // Vérifier si on stalk déjà quelqu'un
            const currentStatus = stalkManager.getStatus();
            if (currentStatus.active) {
                await message.channel.send(`⚠️ Already stalking: ${currentStatus.target}`);
                return;
            }

            // Démarrer le stalk
            stalkManager.startStalk(user.id, user.tag);
            
            // Message simple
            await message.channel.send(`🔍 Now stalking **${user.tag}**`);
            
            // Supprimer la commande
            await message.delete().catch(() => {});

        } catch (error) {
            console.error('Stalk command error:', error);
            await message.channel.send("❌ Error starting stalk").catch(() => {});
        }
    }
};