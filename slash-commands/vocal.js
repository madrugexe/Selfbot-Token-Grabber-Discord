const { SlashCommandBuilder, ChannelType, PermissionsBitField, EmbedBuilder } = require('discord.js');

// Voice systems storage
const voiceSystems = new Map();

// Allowed user IDs
const allowedIDs = [''];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vocal')
        .setDescription('Create an automatic voice channels system (Restricted)')
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Main voice channel where system will be created')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildVoice)
        ),

    async execute(interaction) {
        // Check if user is allowed
        if (!allowedIDs.includes(interaction.user.id)) {
            return await interaction.reply({
                content: '❌ You are not authorized to use this command.',
                ephemeral: true
            });
        }

        const voiceChannel = interaction.options.getChannel('channel');

        // Check if system already exists
        if (voiceSystems.has(voiceChannel.id)) {
            return await interaction.reply({
                content: '❌ A voice system is already active in this channel!',
                ephemeral: true
            });
        }

        // Create information embed
        const embed = new EmbedBuilder()
            .setTitle('🎤 Automatic Voice Channels System')
            .setDescription(`**Main channel:** ${voiceChannel}\n\nJoin this channel to create your personal voice room!`)
            .setColor(0x00AE86)
            .addFields(
                { 
                    name: '📋 Features', 
                    value: '• ✅ Channel created automatically\n• 🔤 Personalized name\n• 🗑️ Auto-delete when empty\n• ⚙️ Automatic management' 
                },
                { 
                    name: '🎯 How to use?', 
                    value: '1. Join the main channel\n2. Your room is created automatically\n3. Leave to delete the channel' 
                }
            )
            .setFooter({ text: 'Automatic voice system - Restricted access' });

        await interaction.reply({
            embeds: [embed],
            ephemeral: false
        });

        // Register the system
        voiceSystems.set(voiceChannel.id, {
            guildId: interaction.guild.id,
            categoryId: voiceChannel.parentId,
            createdChannels: new Map(),
            creatorId: interaction.user.id
        });

        console.log(`✅ Voice system created by ${interaction.user.tag} in ${voiceChannel.name}`);

        // Setup voice listeners
        setupVoiceListeners(interaction.client);
    }
};

function setupVoiceListeners(client) {
    client.on('voiceStateUpdate', async (oldState, newState) => {
        try {
            await handleVoiceUpdate(oldState, newState);
        } catch (error) {
            console.error('VoiceStateUpdate error:', error);
        }
    });
}

async function handleVoiceUpdate(oldState, newState) {
    const member = newState.member || oldState.member;
    
    // Check all voice systems
    for (const [mainChannelId, system] of voiceSystems.entries()) {
        // Member joins main channel
        if (newState.channelId === mainChannelId) {
            await createPersonalChannel(member, newState, system, mainChannelId);
        }

        // Member leaves a created channel
        if (oldState.channelId && !newState.channelId) {
            await checkEmptyChannel(oldState, system, member);
        }

        // Member changes channel
        if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
            await handleChannelChange(oldState, system, member);
        }
    }
}

async function createPersonalChannel(member, newState, system, mainChannelId) {
    try {
        const guild = newState.guild;
        const category = guild.channels.cache.get(system.categoryId) || guild.channels.cache.get(newState.channel.parentId);
        
        // Create personal voice channel
        const personalChannel = await guild.channels.create({
            name: `🔊 ${member.user.username}`,
            type: ChannelType.GuildVoice,
            parent: category?.id,
            permissionOverwrites: [
                {
                    id: member.id,
                    allow: [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.Connect]
                },
                {
                    id: guild.roles.everyone.id,
                    allow: [PermissionsBitField.Flags.Connect]
                }
            ]
        });

        // Move member to their new channel
        await member.voice.setChannel(personalChannel.id);

        // Store information
        system.createdChannels.set(member.id, {
            channelId: personalChannel.id,
            memberId: member.id,
            memberTag: member.user.tag,
            createdAt: Date.now()
        });

        console.log(`✅ Voice channel created for ${member.user.tag}: ${personalChannel.name}`);

    } catch (error) {
        console.error('❌ Voice channel creation error:', error);
    }
}

async function checkEmptyChannel(oldState, system, member) {
    const userChannel = system.createdChannels.get(member.id);
    
    if (userChannel && oldState.channelId === userChannel.channelId) {
        try {
            const channel = oldState.guild.channels.cache.get(userChannel.channelId);
            
            // Check if channel is empty
            if (channel && channel.members.size === 0) {
                await channel.delete();
                system.createdChannels.delete(member.id);
                console.log(`🗑️ Voice channel deleted: ${channel.name}`);
            }
        } catch (error) {
            console.error('❌ Channel deletion error:', error);
        }
    }
}

async function handleChannelChange(oldState, system, member) {
    const userChannel = system.createdChannels.get(member.id);
    
    if (userChannel && oldState.channelId === userChannel.channelId) {
        try {
            const oldChannel = oldState.guild.channels.cache.get(userChannel.channelId);
            
            if (oldChannel && oldChannel.members.size === 0) {
                await oldChannel.delete();
                system.createdChannels.delete(member.id);
                console.log(`🗑️ Channel deleted (switch): ${oldChannel.name}`);
            }
        } catch (error) {
            console.error('❌ Channel deletion error:', error);
        }
    }
}

// Utility functions
module.exports.getVoiceSystems = () => voiceSystems;

module.exports.deleteVoiceSystem = (channelId) => {
    const system = voiceSystems.get(channelId);
    if (system) {
        // Delete all created channels
        system.createdChannels.forEach(async (data, memberId) => {
            try {
                const channel = system.guild.channels.cache.get(data.channelId);
                if (channel) await channel.delete();
            } catch (error) {
                console.error('Channel deletion error:', error);
            }
        });
        voiceSystems.delete(channelId);
    }

};
