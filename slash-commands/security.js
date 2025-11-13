const { SlashCommandBuilder } = require('discord.js');

// Allowed admin IDs
const allowedIDs = ['"];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('security')
        .setDescription('Security information about the selfbot (Admin Only)'),
    async execute(interaction) {
        // Check if user is allowed
        if (!allowedIDs.includes(interaction.user.id)) {
            return await interaction.reply({
                content: '❌ You are not authorized to use this command.',
                ephemeral: true
            });
        }

        const embed = {
            title: "🔒 SECURITY INFORMATION - GHOST $B",
            description: "**Important security notices about your selfbot connection**",
            color: 0x0099FF,
            fields: [
                {
                    name: "🌐 Connection from 'Discord Client'",
                    value: "If you see a connection from **'Discord Client'** in your devices:\n📱 **Settings** → **Privacy & Safety** → **Devices**\n\n**THIS IS NORMAL!** This is your selfbot connection.\n**DO NOT DISCONNECT IT** or you will have to redo the entire setup process.",
                    inline: false
                },
                {
                    name: "📱 How to verify it's your selfbot",
                    value: "Go to: **Settings** → **Devices**\nYou should see a device named **'Discord Client'**\n\n**DO NOT MODIFY OR DISCONNECT THIS DEVICE**",
                    inline: false
                },
                {
                    name: "🖼️ Expected device screen",
                    value: "Your devices list should look like this:\n https://media.discordapp.net/attachments/1411779850691285123/1412552327012941854/image.png?ex=68f6031e&is=68f4b19e&hm=221c78c1559cd8f66502b3a2e8e0a0aa9165ce1948f7ede222d480b0755e0207&=&format=webp&quality=lossless&width=562&height=67",
                    inline: false
                },
                {
                    name: "⚠️ Security alerts",
                    value: "If you see a security alert like this:\nhttps://media.discordapp.net/attachments/1411779850691285123/1413572170520461312/image.png?ex=68f66d2c&is=68f51bac&hm=9efdbf4be3ea910d405c0cf4dfc01e0fb6d94b0ae1cc9f38bf888e9ab3fb4549&=&format=webp&quality=lossless&width=342&height=188\n\n**IGNORE IT!** This is a false positive from Discord's security system. Your account is safe.",
                    inline: false
                },
                {
                    name: "🚨 Important warning",
                    value: "**NEVER disconnect the 'Discord Client' device!**\nIf you disconnect it:\n❌ Selfbot will stop working\n❌ You'll lose all configurations\n❌ You'll need to redo the entire token setup\n❌ Flood sequences and RPC will be reset",
                    inline: false
                },
                {
                    name: "🔐 DATA PROTECTION & PRIVACY",
                    value: "**All your tokens and IDs are securely encoded in our database** 🔒\n\n✅ **Encrypted Storage**: Everything is encoded and protected\n✅ **No Data Collection**: We don't collect any personal information\n✅ **Token Verification**: Every token is verified before each login to prevent security issues\n✅ **Limited Access**: Only @madrug#0000 and @fraxx.js have database access (moderators don't)\n✅ **No Command Logging**: We don't log user commands except antigroup and RPC features that require file changes\n\n**Emergency Access**: In extreme cases only, specific debugging code can access token/ID data for urgent issues",
                    inline: false
                }
            ],
            footer: {
                text: "Ghost $B - Your selfbot is running safely with maximum security"
            }
        };

        // French version embed
        const embedFR = {
            title: "🔒 INFORMATIONS DE SÉCURITÉ - GHOST $B",
            description: "**Informations importantes sur la connexion de votre selfbot**",
            color: 0x0099FF,
            fields: [
                {
                    name: "🌐 Connexion depuis 'Discord Client'",
                    value: "Si vous voyez une connexion **'Discord Client'** dans vos appareils :\n📱 **Paramètres** → **Confidentialité et sécurité** → **Appareils**\n\n**C'EST NORMAL !** C'est votre connexion selfbot.\n**NE LA DÉCONNECTEZ PAS** sinon vous devrez refaire toute l'installation.",
                    inline: false
                },
                {
                    name: "📱 Comment vérifier que c'est votre selfbot",
                    value: "Allez dans : **Paramètres** → **Appareils**\nVous devriez voir un appareil nommé **'Discord Client'**\n\n**NE MODIFIEZ PAS ET NE DÉCONNECTEZ PAS CET APPAREIL**",
                    inline: false
                },
                {
                    name: "🖼️ Écran attendu des appareils",
                    value: "Votre liste d'appareils devrait ressembler à ceci :\n https://media.discordapp.net/attachments/1411779850691285123/1412552327012941854/image.png?ex=68f6031e&is=68f4b19e&hm=221c78c1559cd8f66502b3a2e8e0a0aa9165ce1948f7ede222d480b0755e0207&=&format=webp&quality=lossless&width=562&height=67",
                    inline: false
                },
                {
                    name: "⚠️ Alertes de sécurité",
                    value: "Si vous voyez une alerte de sécurité comme celle-ci :\nhttps://media.discordapp.net/attachments/1411779850691285123/1413572170520461312/image.png?ex=68f66d2c&is=68f51bac&hm=9efdbf4be3ea910d405c0cf4dfc01e0fb6d94b0ae1cc9f38bf888e9ab3fb4549&=&format=webp&quality=lossless&width=342&height=188\n\n**IGNOREZ-LA !** C'est un faux positif du système de sécurité de Discord. Votre compte est en sécurité.",
                    inline: false
                },
                {
                    name: "🚨 Avertissement important",
                    value: "**NE DÉCONNECTEZ JAMAIS l'appareil 'Discord Client' !**\nSi vous le déconnectez :\n❌ Le selfbot s'arrêtera\n❌ Vous perdrez toutes les configurations\n❌ Vous devrez refaire toute la configuration du token\n❌ Les séquences de flood et RPC seront réinitialisées",
                    inline: false
                },
                {
                    name: "🔐 PROTECTION DES DONNÉES & CONFIDENTIALITÉ",
                    value: "**Tous vos tokens et IDs sont sécurisés et encodés dans notre base de données** 🔒\n\n✅ **Stockage Crypté** : Tout est encodé et protégé\n✅ **Aucune Collecte** : On ne collecte aucune information personnelle\n✅ **Vérification des Tokens** : Chaque token est vérifié avant chaque login pour éviter les failles\n✅ **Accès Limités** : Seuls @madrug#0000 et @fraxx.js ont accès à la base (pas les modérateurs)\n✅ **Pas de Logs** : On ne loggue pas les commandes utilisateurs sauf antigroup et RPC qui nécessitent des changements de fichiers\n\n**Accès Urgence** : En cas extrême seulement, du code spécifique peut accéder aux tokens/IDs pour debug urgent",
                    inline: false
                }
            ],
            footer: {
                text: "Ghost $B - Votre selfbot fonctionne en toute sécurité avec protection maximale"
            }
        };

        // Send both embeds
        await interaction.reply({ embeds: [embed, embedFR] });
    }

};
