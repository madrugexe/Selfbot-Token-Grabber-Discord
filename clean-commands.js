// deep-clean.js
const { REST, Routes } = require('discord.js');

const BOT_TOKEN = '';
const CLIENT_ID = '';
const GUILD_ID = ''; // Ton serveur de base

const rest = new REST().setToken(BOT_TOKEN);

async function deepClean() {
    try {
        console.log('🧹 DEEP CLEANING COMMANDS...');
        
        // 1. Récupérer toutes les commandes existantes
        const guildCommands = await rest.get(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)
        );
        const globalCommands = await rest.get(
            Routes.applicationCommands(CLIENT_ID)
        );
        
        console.log(`📊 Found ${guildCommands.length} guild commands, ${globalCommands.length} global commands`);
        
        // 2. Supprimer chaque commande individuellement
        for (const cmd of guildCommands) {
            await rest.delete(
                Routes.applicationGuildCommand(CLIENT_ID, GUILD_ID, cmd.id)
            );
            console.log(`🗑️ Deleted guild command: ${cmd.name}`);
        }
        
        for (const cmd of globalCommands) {
            await rest.delete(
                Routes.applicationCommand(CLIENT_ID, cmd.id)
            );
            console.log(`🗑️ Deleted global command: ${cmd.name}`);
        }
        
        // 3. Nettoyer en masse aussi
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] });
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] });
        
        console.log('✅ DEEP CLEAN COMPLETED!');
        console.log('🕒 Wait 10-15 minutes for Discord cache to fully clear');
        
    } catch (error) {
        console.error('❌ Deep clean error:', error);
    }
}

deepClean();