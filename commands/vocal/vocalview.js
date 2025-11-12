module.exports = {
    name: 'vocalview',
    description: 'Check if a user is in a voice channel and get the link',
    execute: async (client, message, args) => {
        try {
            const user = message.mentions.users.first() || client.users.cache.get(args[0]);
            
            if (!user) {
                await message.channel.send("❌ **Please mention a user or provide a user ID!**");
                return;
            }

            let foundInVoice = false;
            let response = `🔍 **Checking voice channels for ${user.tag}**\n\n`;

            // Parcourir tous les serveurs en commun
            const mutualGuilds = client.guilds.cache.filter(guild => 
                guild.members.cache.has(user.id)
            );

            for (const guild of mutualGuilds.values()) {
                try {
                    const member = guild.members.cache.get(user.id);
                    if (member && member.voice && member.voice.channel) {
                        foundInVoice = true;
                        const voiceChannel = member.voice.channel;
                        
                        response += `🏠 **Server:** ${guild.name}\n`;
                        response += `🎤 **Voice Channel:** ${voiceChannel.name}\n`;
                        response += `🔗 **Voice Link:** https://discord.com/channels/${guild.id}/${voiceChannel.id}\n`;
                        response += `👥 **Users in channel:** ${voiceChannel.members.size}\n`;
                        response += `🔊 **Channel type:** ${voiceChannel.type}\n\n`;
                    }
                } catch (error) {
                    console.error(`Error checking guild ${guild.name}:`, error);
                }
            }

            // Vérifier dans les groupes DM (avec gestion d'erreur)
            try {
                client.channels.cache.forEach(channel => {
                    try {
                        if (channel.type === 'GROUP_DM' && channel.members) {
                            // Vérifier si l'utilisateur est dans le groupe
                            const userInGroup = channel.members.some(member => member.id === user.id);
                            if (userInGroup) {
                                foundInVoice = true;
                                response += `👥 **Group DM:** ${channel.name || 'Unnamed Group'}\n`;
                                response += `🔗 **Group Info:** Group DM (no direct link)\n`;
                                response += `👥 **Members:** ${channel.members.size}\n\n`;
                            }
                        }
                    } catch (channelError) {
                        console.error(`Error checking channel ${channel.id}:`, channelError);
                    }
                });
            } catch (groupError) {
                console.error('Error checking groups:', groupError);
            }

            if (!foundInVoice) {
                response += `❌ **${user.tag} is not in any voice channel**\n`;
                response += `📡 Checked ${mutualGuilds.size} servers`;
            }

            await message.channel.send(response);
            await message.delete().catch(() => {});

        } catch (error) {
            console.error('Vocalview error:', error);
            await message.channel.send("❌ Error checking voice channels").catch(() => {});
        }
    }
};