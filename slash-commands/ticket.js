const { SlashCommandBuilder, ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

// Ticket systems storage
const ticketSystems = new Map();

// Allowed user IDs for command
const allowedIDs = [''];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Create a ticket system (Everyone can open, Admins only can talk)')
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Channel where ticket message will be sent')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addRoleOption(option =>
            option
                .setName('admin-role')
                .setDescription('Admin role that will respond to tickets (optional)')
                .setRequired(false)
        ),

    async execute(interaction) {
        // Check if user is allowed to create the system
        if (!allowedIDs.includes(interaction.user.id)) {
            return await interaction.reply({
                content: '❌ You are not authorized to use this command.',
                ephemeral: true
            });
        }

        const ticketChannel = interaction.options.getChannel('channel');
        const adminRole = interaction.options.getRole('admin-role');

        // Check if system already exists
        if (ticketSystems.has(ticketChannel.id)) {
            return await interaction.reply({
                content: '❌ A ticket system is already active in this channel!',
                ephemeral: true
            });
        }

        // Create ticket embed
        const embed = new EmbedBuilder()
            .setTitle('🎫 Support Ticket System')
            .setDescription('Click the button below to create a support ticket!\n**Only administrators can respond to tickets.**')
            .setColor(0x0099FF)
            .addFields(
                { 
                    name: '📋 How does it work?', 
                    value: '• 🎫 Anyone can create a ticket\n• 🔒 Private and secure channel\n• 👨‍💼 Only admins can respond\n• ⚡ Fast response guaranteed' 
                },
                { 
                    name: '🎯 Steps', 
                    value: '1. Click "Create Ticket"\n2. Describe your problem\n3. Wait for admin response\n4. Only admins can talk in the ticket' 
                },
                { 
                    name: '⚠️ Important', 
                    value: 'Only administrators are allowed to send messages in tickets. Users can only read admin responses.' 
                }
            )
            .setFooter({ text: 'Support System - Admin responses only' });

        // Create ticket button
        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('create_ticket_system')
                    .setLabel('🎫 Create Support Ticket')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('📩')
            );

        await interaction.reply({
            content: `✅ Ticket system created in ${ticketChannel}! Everyone can open tickets, but only admins can talk.`,
            ephemeral: true
        });

        // Send ticket message
        const ticketMessage = await ticketChannel.send({
            embeds: [embed],
            components: [buttonRow]
        });

        // Register the system
        ticketSystems.set(ticketChannel.id, {
            guildId: interaction.guild.id,
            messageId: ticketMessage.id,
            adminRoleId: adminRole?.id,
            creatorId: interaction.user.id,
            activeTickets: new Map(),
            createdAt: Date.now()
        });

        console.log(`✅ Ticket system created by ${interaction.user.tag} in ${ticketChannel.name}`);

        // Setup listeners
        setupTicketListeners(interaction.client);
    }
};

function setupTicketListeners(client) {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isButton()) return;
        
        if (interaction.customId === 'create_ticket_system') {
            await handleTicketCreation(interaction);
        }
        
        if (interaction.customId === 'close_ticket_button') {
            await handleTicketClose(interaction);
        }
    });

    // Listen for messages in ticket channels
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;
        
        // Check if message is in a ticket channel
        const ticketSystem = Array.from(ticketSystems.values())
            .find(sys => sys.activeTickets.has(message.channel.id));
        
        if (ticketSystem) {
            await handleTicketMessage(message, ticketSystem);
        }
    });
}

async function handleTicketMessage(message, ticketSystem) {
    const member = message.member;
    const ticket = ticketSystem.activeTickets.get(message.channel.id);
    
    if (!ticket) return;

    // Check if user is admin or the system creator
    const isAdmin = member.permissions.has(PermissionsBitField.Flags.Administrator) || 
                   member.id === ticketSystem.creatorId ||
                   (ticketSystem.adminRoleId && member.roles.cache.has(ticketSystem.adminRoleId));

    // If user is not admin and not the ticket creator, delete their message
    if (!isAdmin && member.id !== ticket.creatorId) {
        try {
            await message.delete();
            
            // Send warning message
            const warning = await message.channel.send({
                content: `${member}, ❌ Only administrators are allowed to send messages in tickets.`,
                ephemeral: false
            });
            
            // Delete warning after 5 seconds
            setTimeout(async () => {
                try {
                    await warning.delete();
                } catch (error) {
                    console.error('Warning deletion error:', error);
                }
            }, 5000);
            
        } catch (error) {
            console.error('Message deletion error:', error);
        }
    }
}

async function handleTicketCreation(interaction) {
    const member = interaction.member;
    const guild = interaction.guild;

    // Find ticket system
    const ticketSystem = Array.from(ticketSystems.values())
        .find(sys => sys.guildId === guild.id);

    if (!ticketSystem) {
        return await interaction.reply({
            content: '❌ Ticket system not found!',
            ephemeral: true
        });
    }

    // Check if user already has a ticket
    const existingTicket = Array.from(ticketSystem.activeTickets.values())
        .find(ticket => ticket.creatorId === member.id);

    if (existingTicket) {
        return await interaction.reply({
            content: `❌ You already have an open ticket: <#${existingTicket.channelId}>`,
            ephemeral: true
        });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
        // Create or find tickets category
        let ticketCategory = guild.channels.cache.find(
            channel => channel.type === ChannelType.GuildCategory && channel.name === '🎫 TICKETS'
        );

        if (!ticketCategory) {
            ticketCategory = await guild.channels.create({
                name: '🎫 TICKETS',
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: [PermissionsBitField.Flags.ViewChannel]
                    }
                ]
            });
        }

        // Create ticket channel
        const ticketChannel = await guild.channels.create({
            name: `ticket-${member.user.username.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            type: ChannelType.GuildText,
            parent: ticketCategory.id,
            topic: `Support ticket from ${member.user.tag}`,
            permissionOverwrites: [
                // Deny access to everyone by default
                {
                    id: guild.roles.everyone.id,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                },
                // Ticket creator can only VIEW (read-only)
                {
                    id: member.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
                    deny: [PermissionsBitField.Flags.SendMessages]
                }
            ]
        });

        // Add permissions for admins (can send messages)
        const adminPermissions = [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.ManageMessages,
            PermissionsBitField.Flags.ManageChannels
        ];

        // Specific admin role
        if (ticketSystem.adminRoleId) {
            await ticketChannel.permissionOverwrites.edit(ticketSystem.adminRoleId, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
                ManageMessages: true,
                ManageChannels: true
            });
        }

        // All administrators
        const adminRole = guild.roles.cache.find(role => role.permissions.has(PermissionsBitField.Flags.Administrator));
        if (adminRole) {
            await ticketChannel.permissionOverwrites.edit(adminRole.id, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
                ManageMessages: true,
                ManageChannels: true
            });
        }

        // System creator can also send messages
        await ticketChannel.permissionOverwrites.edit(ticketSystem.creatorId, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            ManageMessages: true,
            ManageChannels: true
        });

        // Welcome message
        const welcomeEmbed = new EmbedBuilder()
            .setTitle('🎫 Support Ticket Created')
            .setDescription(`Hello ${member}! A support ticket has been created for you.`)
            .setColor(0x00FF00)
            .addFields(
                { name: '👤 User', value: `${member.user.tag}`, inline: true },
                { name: '🆔 ID', value: `${member.id}`, inline: true },
                { name: '📅 Created', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
                { 
                    name: '💡 Important Information', 
                    value: '**Only administrators can send messages in this ticket.**\nYou will be able to read all responses from the support team.' 
                },
                { 
                    name: '🔒 Ticket Rules', 
                    value: '• Wait for admin response\n• Do not try to send messages\n• Read all admin messages carefully\n• Ticket will be closed when issue is resolved' 
                }
            )
            .setFooter({ text: 'Support Ticket - Admin responses only' });

        // Control buttons (only admins can use them)
        const controlButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('close_ticket_button')
                    .setLabel('🔒 Close Ticket')
                    .setStyle(ButtonStyle.Danger)
            );

        await ticketChannel.send({
            content: `${member} ${ticketSystem.adminRoleId ? `<@&${ticketSystem.adminRoleId}>` : ''}\n**📢 Support team needed!**`,
            embeds: [welcomeEmbed],
            components: [controlButtons]
        });

        // Register the ticket
        ticketSystem.activeTickets.set(ticketChannel.id, {
            creatorId: member.id,
            creatorTag: member.user.tag,
            channelId: ticketChannel.id,
            createdAt: Date.now(),
            messageCount: 0
        });

        await interaction.editReply({
            content: `✅ Your support ticket has been created: ${ticketChannel}\n\n**Remember:** Only administrators can send messages in the ticket. You can read all responses.`
        });

        console.log(`🎫 New support ticket created by ${member.user.tag}: ${ticketChannel.name}`);

    } catch (error) {
        console.error('❌ Ticket creation error:', error);
        await interaction.editReply({
            content: '❌ Error creating support ticket! Please try again.'
        });
    }
}

async function handleTicketClose(interaction) {
    const channel = interaction.channel;
    const member = interaction.member;
    const guild = interaction.guild;

    // Find system and ticket
    const ticketSystem = Array.from(ticketSystems.values())
        .find(sys => sys.guildId === guild.id);
    
    if (!ticketSystem) return;

    const ticket = ticketSystem.activeTickets.get(channel.id);
    if (!ticket) return;

    // Check permissions - only admins can close tickets
    const canClose = member.permissions.has(PermissionsBitField.Flags.Administrator) || 
                    member.id === ticketSystem.creatorId ||
                    (ticketSystem.adminRoleId && member.roles.cache.has(ticketSystem.adminRoleId));

    if (!canClose) {
        return await interaction.reply({
            content: '❌ Only administrators can close tickets!',
            ephemeral: true
        });
    }

    await interaction.deferReply();

    try {
        // Create closing embed
        const closeEmbed = new EmbedBuilder()
            .setTitle('🔒 Ticket Closed')
            .setDescription(`This support ticket has been closed by ${member.user.tag}`)
            .setColor(0xFF0000)
            .addFields(
                { name: '👤 User', value: ticket.creatorTag, inline: true },
                { name: '⏱️ Duration', value: `${Math.round((Date.now() - ticket.createdAt) / 60000)} minutes`, inline: true },
                { name: '📅 Closed', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
                { 
                    name: '📝 Note', 
                    value: 'Thank you for using our support system. If you need further assistance, please create a new ticket.' 
                }
            )
            .setFooter({ text: 'Support Ticket Closed' });

        await channel.send({ embeds: [closeEmbed] });

        // Delete channel after delay
        setTimeout(async () => {
            try {
                await channel.delete();
                ticketSystem.activeTickets.delete(channel.id);
                console.log(`🔒 Support ticket closed: ${channel.name}`);
            } catch (error) {
                console.error('❌ Ticket deletion error:', error);
            }
        }, 10000);

        await interaction.editReply({
            content: '✅ Support ticket closed! Channel will be deleted in 10 seconds.'
        });

    } catch (error) {
        console.error('❌ Ticket closing error:', error);
        await interaction.editReply({
            content: '❌ Error closing support ticket!'
        });
    }
}

// Utility functions
module.exports.getTicketSystems = () => ticketSystems;

module.exports.getUserTickets = (userId) => {
    const userTickets = [];
    ticketSystems.forEach(system => {
        system.activeTickets.forEach((ticket, channelId) => {
            if (ticket.creatorId === userId) {
                userTickets.push({ ...ticket, system });
            }
        });
    });
    return userTickets;

};
