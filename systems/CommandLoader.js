const fs = require('fs');
const path = require('path');

class CommandLoader {
    constructor() {
        this.commands = new Map();
        this.loadAllCommands();
    }

    loadAllCommands() {
        const commandsPath = path.join(__dirname, '../commands');
        
        if (!fs.existsSync(commandsPath)) {
            console.error('❌ Commands directory not found');
            return;
        }

        const categories = fs.readdirSync(commandsPath);

        categories.forEach(category => {
            const categoryPath = path.join(commandsPath, category);
            if (fs.statSync(categoryPath).isDirectory()) {
                const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));
                
                commandFiles.forEach(file => {
                    try {
                        const commandPath = path.join(categoryPath, file);
                        const command = require(commandPath);
                        
                        // Gestion spéciale pour les fichiers avec multiples exports (help-categories)
                        if (file === 'help-categories.js') {
                            this.loadHelpCategoryCommands(command);
                        } else if (command.name && typeof command.execute === 'function') {
                            this.commands.set(command.name, command);
                            console.log(`✅ Command loaded: ${command.name}`);
                        } else {
                            console.error(`❌ Invalid command structure in ${file}`);
                        }
                    } catch (error) {
                        console.error(`❌ Error loading command ${file}:`, error);
                    }
                });
            }
        });

        console.log(`📁 ${this.commands.size} commands loaded`);
    }

    loadHelpCategoryCommands(helpModule) {
        // Charger toutes les commandes d'aide de catégories
        Object.keys(helpModule).forEach(key => {
            if (helpModule[key] && helpModule[key].name && typeof helpModule[key].execute === 'function') {
                this.commands.set(helpModule[key].name, helpModule[key]);
                console.log(`✅ Command loaded: ${helpModule[key].name}`);
            }
        });
    }

    loadCommands(client) {
        // Gestion des messages
        client.on('messageCreate', async (message) => {
            if (message.author.id !== client.user.id) return;
            if (!message.content.startsWith(client.config.prefix)) return;

            const args = message.content.slice(client.config.prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const command = this.commands.get(commandName);
            if (!command) return;

            try {
                await command.execute(client, message, args);
            } catch (error) {
                console.error(`❌ Command execution error for ${commandName}:`, error);
                try {
                    // ✅ CORRECTION : Toujours envoyer un contenu valide
                    await message.channel.send('❌ An error occurred while executing this command.');
                } catch (sendError) {
                    console.error('❌ Unable to send error message:', sendError);
                }
            }
        });

        // Événement messageDelete pour snipe
        client.on("messageDelete", (msg) => {
            client.snipes.set(msg.channel.id, {
                content: msg.content || "❌ (no content)",
                author: msg.author ? msg.author.tag : "❌ Unknown",
                image: msg.attachments.first() ? msg.attachments.first().url : null,
                date: Date.now()
            });
        });

        // Gestion des commandes NSFW
        client.on('messageCreate', async (message) => {
            if (message.author.id !== client.user.id) return;
            if (!message.content.startsWith(client.config.prefix)) return;

            const args = message.content.slice(client.config.prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            // Vérifier si c'est une commande NSFW
            const nsfwCommands = ['hentai', 'branlette', 'ph', 'x'];
            if (nsfwCommands.includes(commandName)) {
                const nsfwCommand = this.commands.get(commandName);
                if (nsfwCommand) {
                    try {
                        await nsfwCommand.execute(client, message, args);
                    } catch (error) {
                        console.error(`❌ NSFW command error for ${commandName}:`, error);
                    }
                }
            }
        });
    }

    getCommand(name) {
        return this.commands.get(name);
    }

    getAllCommands() {
        return this.commands;
    }
}

module.exports = CommandLoader;